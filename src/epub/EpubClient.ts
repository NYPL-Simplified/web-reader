import * as React from 'react';
import ReaderClient from '../ReaderClient';
import ePub, { Book, Location, Rendition } from 'epubjs';
import { EpubLocation } from '../types';
import EpubRenderer from './EpubRenderer';

export default class EpubClient implements ReaderClient<EpubLocation> {
  static readonly EPUB_JS_WRAPPER_ID = 'epub-js-wrapper';
  readonly Renderer = EpubRenderer;
  private readonly book: Book;
  readonly rendition: Rendition;
  title: string;
  author: string;

  // we use this when generating locations for the book, it is the
  // number of chars to break sections by. 150 was the Epub.js default.
  locationSplit: number = 150;

  private constructor(
    book: Book,
    rendition: Rendition,
    title: string,
    author: string
  ) {
    this.book = book;
    this.rendition = rendition;
    this.title = title;
    this.author = author;
  }

  // an async constructor to make our client.
  static async init(url: string): Promise<EpubClient> {
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

    // here we could possibly set up our location change listeners
    // and update the state if we pass it in?

    return new EpubClient(book, rendition, title, author);
  }

  // passing undefined to rendition.display() will show the
  // first page.
  get startLocation() {
    return undefined;
  }

  get totalChapters(): number {
    return this.book.navigation.toc.length;
  }
}
