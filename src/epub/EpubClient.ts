import ReaderClient from '../ReaderClient';
import ePub, { Book } from 'epubjs';

export default class EpubClient implements ReaderClient<string> {
  title: string;
  author: string;
  totalChapters: number;
  startLocation: string;

  private constructor(
    private readonly book: Book,
    title: string,
    author: string,
    totalChapters: number
  ) {
    this.title = title;
    this.author = author;
    this.totalChapters = totalChapters;
    this.startLocation = 'blah';
  }

  // an async constructor to make our sync client
  static async init(url: string): Promise<EpubClient> {
    const book = ePub(url);
    const metadata = await book.loaded.metadata;
    const { title, creator: author } = metadata;

    return new EpubClient(book, title, author, 0);
  }

  get startUrl(): string {
    return 'unimplemented';
  }

  // content
  contentFor(chapter: number): string {
    return 'unimplemented';
  }
}
