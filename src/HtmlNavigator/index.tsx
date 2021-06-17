import D2Reader from '@d-i-t-a/reader';
import { NavigatorArguments, VisualNavigator } from '../Navigator';
import { Locator, ReadingPosition } from '@d-i-t-a/reader/dist/model/Locator';
import '@d-i-t-a/reader/dist/reader.css';
import EpubContent from './HtmlNavigatorContent';
import { WebpubManifest } from '../types';
import { fetchJson } from '../utils/fetch';

/**
 * This Navigator is meant to work with any HTML based webpub. So an ePub
 * or a Mobi, or even just html pages packaged into a collection.
 */
export default class HtmlNavigator implements VisualNavigator {
  static Content = EpubContent;

  private constructor(readonly reader: D2Reader) {}

  static async init({
    webpubManifestUrl,
    getContent,
  }: NavigatorArguments): Promise<HtmlNavigator> {
    const url = new URL(webpubManifestUrl);
    const reader = await D2Reader.build({
      url,
      injectables: injectables as any,
      api: {
        getContent,
      },

      // all of these were required
      userSettings: {
        verticalScroll: 'readium-scroll-off',
      },
      initialAnnotations: undefined,
      lastReadingPosition: undefined,
      upLinkUrl: undefined,
      material: {
        settings: {
          fontOverride: false,
          advancedSettings: false,
          pageMargins: false,
          lineHeight: false,
        },
      },
      rights: {
        autoGeneratePositions: false,
      },
      tts: undefined,
      search: { color: 'red', current: 'blah' },
      annotations: { initialAnnotationColor: 'blue' },
      highlighter: { selectionMenuItems: [] },
      useLocalStorage: false,
      attributes: { margin: 2 },
      // TODO: Fix this any assertion
    } as any);

    return new HtmlNavigator(reader);
  }

  // get isScrolling(): boolean {
  //   return this.reader.isScroll();
  // }

  get readingProgression(): ReadingPosition {
    return {
      created: new Date(),
      href: '/blah',
      locations: {},
    };
  }

  get currentLocation() {
    return this.reader.currentLocator;
  }

  async goTo(locator: Locator) {
    try {
      await this.reader.goTo(locator);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async goForward() {
    try {
      await this.reader.nextPage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async goBackward() {
    try {
      await this.reader.previousPage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async goLeft() {
    return this.goBackward();
  }
  async goRight() {
    return this.goForward();
  }

  // settings
  scroll() {
    this.reader.scroll(true);
  }
  paginate() {
    this.reader.scroll(false);
  }
  get isScroll() {
    const settings = this.reader.currentSettings();
    console.log(settings);
    return false;
  }

  static async fetchManifest(url: string): Promise<WebpubManifest> {
    const manifest: WebpubManifest = await fetchJson(url);
    return manifest;
  }
}

const injectables = [
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-before.css',
    r2before: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-default.css',
    r2default: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-after.css',
    r2after: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/pagebreak/pagebreak.css',
    r2after: true,
  },
  // { type: 'style', url: 'http://localhost:1234/viewer/readium-css/neon-after.css', r2after: true, appearance: 'neon' },
  {
    type: 'script',
    url:
      'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=TeX-MML-AM_CHTML&latest',
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/fonts/opendyslexic/opendyslexic.css',
    fontFamily: 'opendyslexic',
    systemFont: false,
  },
  { type: 'style', fontFamily: 'Courier', systemFont: true },
  // {
  //   type: 'script',
  //   url: 'http://localhost:1234/viewer/injectables/click/click.js',
  // },
  // {
  //   type: 'script',
  //   url: 'http://localhost:1234/viewer/injectables/footnotes/footnotes.js',
  // },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/footnotes/footnotes.css',
  },
  // {
  //   type: 'script',
  //   url: 'http://localhost:1234/viewer/injectables/glossary/glossary.js',
  // },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/glossary/glossary.css',
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/style/style.css',
  },
];
