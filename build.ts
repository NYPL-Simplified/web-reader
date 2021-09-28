import { build as esbuild, BuildOptions } from 'esbuild';
import util from 'util';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import { watch } from 'chokidar';
import { debounce } from 'debounce';
import origRimraf from 'rimraf';
import child_process from 'child_process';

const rimraf = util.promisify(origRimraf);
const exec = util.promisify(child_process.exec);

/**
 * @todo
 *
 * - Figure out how to export the fonts and include them with dynamic urls in the css?
 * - Possibly export a CJS or IIFE version?
 * - Possibly add postcss or something to support namespaces?
 */

const isWatchEnabled = process.argv[2] === '-w';
// for now we bundle for production whenever we aren't in watch mode
const isProduction = !isWatchEnabled;

/**
 * Generates TS Declarations using tsc. Is pretty slow : /.
 */
async function generateDts() {
  try {
    return await exec(
      `tsc --declaration --emitDeclarationOnly --declarationDir dist/types`
    );
  } catch (e) {
    return Promise.reject(e.stdout);
  }
}

/**
 * Builds Typescript (or JS) using ESBuild. Super fast and easy.
 */
async function buildTs(
  options: BuildOptions,
  successMsg: string,
  filename: string
) {
  const config: BuildOptions = {
    bundle: true,
    // what browsers we want to support, this is basically all >1% usage
    target: ['es2016', 'chrome89', 'firefox88', 'safari14', 'edge90'],
    external: [
      'react-dom',
      'react',
      /**
       * @todo - We currently ignore these fonts, but we need to figure out a better way
       * to include them
       */
      'fonts/AccessibleDfA.otf',
      'fonts/iAWriterDuospace-Regular.ttf',
    ],
    sourcemap: true,
    define: {
      // note these need to be double quoted if we want to define string constants
      'process.env.NODE_ENV': isProduction ? "'production'" : "'development'",
    },
    tsconfig: 'tsconfig.build.json',
    ...options,
  };

  try {
    const r = await esbuild(config);
    logBundled(successMsg, filename);
    return r;
  } catch (e) {
    return Promise.reject(e.stdout);
  }
}

/**
 * Build pipeline:
 *  - clean the build folder
 *  - build esm version (for: import WebReader from "@nypl/web-reader")
 *  - generate TS declarations
 *
 *  Do all of this in parallel and wait for it all to finish.
 *  Optionally watch for changes!
 */
async function buildAll() {
  await rimraf('dist/');
  await fs.mkdir('dist');
  console.log('🧹 Cleaned output folder -', chalk.blue('dist/'));

  const entryPoints = ['src/index.tsx', 'src/ServiceWorker/sw.ts'];

  // build the main entrypoint as a CommonJS module
  const p1 = buildTs(
    {
      format: 'cjs',
      entryPoints,
      outdir: 'dist/cjs',
      minify: isProduction,
    },
    'Compiled CommonJS Module (for node `require` statements)',
    'dist/cjs/index.js'
  );

  // build the main entrypoint as an ES Module.
  // This one doesn't need to be minified because it will
  // be rebundled by the consumer's bundler
  const p2 = buildTs(
    {
      format: 'esm',
      entryPoints,
      outdir: 'dist/esm',
      minify: false,
    },
    "Compiled ESM (for 'import WebReader' uses)",
    'dist/esm/index.js'
  );

  // compile the CSS to the root
  const p3 = buildTs(
    {
      entryPoints: {
        'pdf-styles': 'src/PdfReader/styles.css',
        'html-styles': 'src/HtmlReader/styles.css',
      },
      outdir: 'dist',
      minify: isProduction,
    },
    'Compiled CSS',
    'dist/*-styles.css'
  );

  // generate type declarations
  const p4 = generateDts()
    .then(() =>
      logBundled('Generated TS Declarations', 'dist/types/index.d.ts')
    )
    .catch((e) => err('TS Error', e));

  // wait for everything to finish running in parallel
  await Promise.all([p1, p2, p3, p4]);
  console.log('🔥 Build finished.');
}

// debounce the build command so that it only ever runs once every 100ms
// in watch mode
const debouncedBuildAll = debounce(buildAll, 1000);

// starts chokidar to watch the directory for changes
async function startWatcher() {
  const ignored = [
    '.parcel-cache',
    '.git',
    'node_modules',
    'dist',
    'example',
    'cypress',
    'coverage',
    '.husky',
    '.storybook',
  ];
  const watchPaths = ['.'];
  console.log('👀 Watching for changes...');
  const watcher = watch(watchPaths, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored,
  });

  watcher.on('all', async (type: string, file: string) => {
    console.log(`\n🕝 Change detected: ${type} ${file}`);
    debouncedBuildAll();
  });
}

/**
 * Some logging utils
 */
const log = (msg: string, file?: string) => console.log(msg, chalk.blue(file));
const err = (title: string, e: string) =>
  console.error(chalk.red(`❌ ${title}:`), e);
const logBundled = (msg: string, file: string) => log(`📦 ${msg} -`, file);

/**
 * The main entrypoint for the script
 */
console.log(
  `🌪  Building @nypl/web-reader${isWatchEnabled ? ' in watch mode...' : '...'}`
);
buildAll().then(() => {
  if (isWatchEnabled) {
    startWatcher();
  }
});
