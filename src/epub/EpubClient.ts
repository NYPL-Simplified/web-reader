import ReaderClient from '../ReaderClient';
import ePub, { Book } from 'epubjs';

export default class EpubClient implements ReaderClient {
  private readonly book: Book;

  private constructor(url: string) {
    this.book = ePub(url);
  }
  static async init(url: string): Promise<EpubClient> {
    return new EpubClient(url);
  }

  get startUrl(): string {
    return 'unimplemented';
  }

  // metadata
  get title(): string {
    return 'Unimplemented';
  }
  get author(): string {
    return 'Unimplemented';
  }

  // chapters
  get totalChapters(): number {
    return 0;
  }

  // content
  contentFor(chapter: number): string {
    return 'unimplemented';
  }
}
