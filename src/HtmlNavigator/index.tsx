// import D2Reader, { ReadingPosition, Locator } from '@d-i-t-a/reader';
import D2Reader from '@d-i-t-a/reader';
import { Locator, ReadingPosition } from '@d-i-t-a/reader/dist/model/Locator';
import Navigator, { NavigatorArguments } from '../Navigator';
import '@d-i-t-a/reader/dist/reader.css';
import EpubContent from './HtmlNavigatorContent';
import { ColorMode, WebpubManifest } from '../types';
import { fetchJson } from '../utils/fetch';
import { mutating } from '../decorators';

/**
 * This Navigator is meant to work with any HTML based webpub. So an ePub
 * or a Mobi, or even just html pages packaged into a collection.
 */
export default class HtmlNavigator extends Navigator {
  static Content = EpubContent;

  private readonly reader: D2Reader;

  private constructor(didMutate: () => void, reader: D2Reader) {
    super(didMutate);
    this.reader = reader;
  }

  static async init({
    webpubManifestUrl,
    didMutate,
  }: NavigatorArguments): Promise<HtmlNavigator> {
    const url = new URL(webpubManifestUrl);
    const reader = await D2Reader.build({
      url,
      injectables: injectables as any,

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

    const navigator = new HtmlNavigator(didMutate, reader);
    return navigator;
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
    throw new Error('currentLocation Not implemented');
    return {
      href: 'blah',
      title: 'blah',
      locations: {},
    };
    // return this.reader.currentLocator;
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
  @mutating
  scroll() {
    this.reader.scroll(true);
  }

  @mutating
  paginate() {
    this.reader.scroll(false);
  }
  get isScrolling() {
    return this.reader.currentSettings.verticalScroll;
  }
  toggleScroll = () => {
    if (this.isScrolling) {
      this.paginate();
    } else {
      this.scroll();
    }
  };

  // @mutating
  setColorMode = (mode: ColorMode) => {
    return this.reader.applyUserSettings({ appearance: mode } as any);
  };
  get colorMode() {
    return this.reader.currentSettings.appearance as ColorMode;
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
