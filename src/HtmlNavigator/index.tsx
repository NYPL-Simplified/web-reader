// import D2Reader, { ReadingPosition, Locator } from '@d-i-t-a/reader';
import D2Reader from '@d-i-t-a/reader';
import { Locator, ReadingPosition } from '@d-i-t-a/reader/dist/model/Locator';
import Navigator, { NavigatorArguments } from '../Navigator';
import '@d-i-t-a/reader/dist/reader.css';
import EpubContent from './HtmlNavigatorContent';
import { ColorMode, WebpubManifest } from '../types';
import { fetchJson } from '../utils/fetch';
import { mutating } from '../decorators';
import injectables from './injectables';

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

    /**
     * We have to bind all of the non arrow functions that use the mutating decorator
     */
    this.goForward = this.goForward.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.scroll = this.scroll.bind(this);
    this.paginate = this.paginate.bind(this);
    this.setColorMode = this.setColorMode.bind(this);
  }

  static async init({
    webpubManifestUrl,
    didMutate,
  }: NavigatorArguments): Promise<HtmlNavigator> {
    const url = new URL(webpubManifestUrl);
    const reader = await D2Reader.build({
      url,
      injectables: injectables,
      injectablesFixed: [],
    });

    const navigator = new HtmlNavigator(didMutate, reader);
    return navigator;
  }

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

  @mutating
  async goForward() {
    try {
      await this.reader.nextPage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @mutating
  async goBackward() {
    try {
      await this.reader.previousPage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  goLeft = async () => {
    return await this.goBackward();
  };
  goRight = async () => {
    return await this.goForward();
  };

  // scrolling
  get isScrolling() {
    return this.reader.currentSettings.verticalScroll;
  }

  @mutating
  scroll() {
    this.reader.scroll(true);
  }

  @mutating
  paginate() {
    this.reader.scroll(false);
  }

  toggleScroll = () => {
    if (this.isScrolling) {
      this.paginate();
    } else {
      this.scroll();
    }
  };

  // color mode
  get colorMode() {
    return this.reader.currentSettings.appearance as ColorMode;
  }

  @mutating
  setColorMode(mode: ColorMode) {
    return this.reader.applyUserSettings({ appearance: mode } as any);
  }

  static async fetchManifest(url: string): Promise<WebpubManifest> {
    const manifest: WebpubManifest = await fetchJson(url);
    return manifest;
  }
}
