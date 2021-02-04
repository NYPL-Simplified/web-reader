import { fetchJson } from '../fetch';
import ReaderClient from '../ReaderClient';
import { PdfManifest } from '../types';
import PdfRenderer from './PdfRenderer';

export default class PdfClient implements ReaderClient<number> {
  readonly Renderer = PdfRenderer;
  private constructor(readonly manifest: PdfManifest) {}

  // an async constructor function that fetches the manifest and then
  // returns a new client using it
  static async init(entrypoint: string): Promise<PdfClient> {
    const manifest = await fetchJson(entrypoint);
    return new PdfClient(manifest);
  }

  get startLocation(): number {
    return 0;
    // return this.manifest.spine[0].href;
  }

  // metadata
  get title(): string {
    return this.manifest.metadata.title;
  }
  get author(): string {
    return this.manifest.metadata.author;
  }

  // chapters
  get totalChapters(): number {
    return this.manifest.spine.length - 1;
  }

  // content
  contentFor(chapter: number): string {
    const ch = this.manifest.spine[chapter];
    if (!ch) throw new Error(`No Chapter ${chapter}`);
    return ch.href;
  }
}
