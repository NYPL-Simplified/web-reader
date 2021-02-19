import ReaderClient from '../ReaderClient';
import ePub, { Book, Location, Rendition } from 'epubjs';
import { EpubLocation, SetLocation } from '../types';
import EpubRenderer from './EpubRenderer';

export default class EpubClient implements ReaderClient<EpubLocation> {
  static readonly EPUB_JS_WRAPPER_ID = 'epub-js-wrapper';
  private readonly setLocation: (location: EpubLocation) => void;
  readonly Renderer = EpubRenderer;
  private readonly book: Book;
  readonly rendition: Rendition;
  title: string;
  author: string;

  // we use this when generating locations for the book, it is the
  // number of chars to break sections by. 150 was the Epub.js default.
  locationSplit: number = 150;

  private constructor(
    setLocation: SetLocation<EpubLocation>,
    book: Book,
    rendition: Rendition,
    title: string,
    author: string
  ) {
    this.setLocation = setLocation;
    this.book = book;
    this.rendition = rendition;
    this.title = title;
    this.author = author;
  }

  // an async constructor to make our client.
  static async init(
    url: string,
    setLocation: SetLocation<EpubLocation>
  ): Promise<EpubClient> {
    const book = ePub(url);

    // metadata
    const metadata = await book.loaded.metadata;
    const { title, creator: author } = metadata;

    // wait for the whole book to be parsed and ready before continuing
    // otherwise properties on the book will be undefined and we will
    // hit errors.
    await book.ready;

    // render the book and get the rendition
    const rendition = book.renderTo(this.EPUB_JS_WRAPPER_ID, {
      height: '100%',
    });

    // wait for the rendition to be "started", whatever that means
    await rendition.started;

    // here set up a listener to keep the useWebReader hook state
    // up to date whenever the location changes. This doesn't
    // technically do anything in this case since he state is really
    // managed by epub.js, but we're going to keep it up to date anyway
    rendition.on('relocated', (loc: Location) => {
      setLocation(loc.start.cfi);
    });

    // display the book
    rendition.display();

    return new EpubClient(setLocation, book, rendition, title, author);
  }

  // passing undefined to rendition.display() will show the
  // first page.
  get startLocation() {
    return undefined;
  }

  async nextPage() {
    await this.rendition.next();
    // the loc is actually a Location not a DisplayedLocation
    // const loc = (await this.rendition.currentLocation()) as Location;
    // this.setLocation(loc.start.cfi);
    // return loc.start.cfi;
  }

  async prevPage() {
    console.log('calling prev');
    await this.rendition.prev();
    // the loc is actually a Location not a DisplayedLocation
    // const loc = (await this.rendition.currentLocation()) as Location;
    // this.setLocation(loc.start.cfi);
    // return loc.start.cfi;
  }
}
