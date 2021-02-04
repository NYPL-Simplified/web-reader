import { fetchJson } from '../fetch';
import ReaderClient from '../ReaderClient';
import { WebpubManifest } from '../types';
import WebpubRenderer from './WebpubRenderer';

export class WebpubClient implements ReaderClient<number> {
  readonly Renderer = WebpubRenderer;
  private constructor(readonly manifest: WebpubManifest) {}

  static async init(entrypoint: string): Promise<WebpubClient> {
    const manifest = await fetchJson(entrypoint);
    return new WebpubClient(manifest);
  }

  // content
  get startLocation(): number {
    return 0;
    // const startPath = this.manifest.spine[0].href;
    // return this.makeUrl(startPath);
  }

  // metadata
  get title(): string {
    return 'unimplemented webpub';
  }
  get author(): string {
    return 'unimplemented author';
  }

  get totalChapters(): number {
    return 666;
  }

  contentFor(location: number): string {
    const ch = this.manifest.spine[location];
    if (!ch) throw new Error(`No Chapter ${location}`);
    return this.makeUrl(ch.href);
  }

  /**
   * Take a url relative to the iframe root and turn it into
   * an absolute url including the domain and everything
   * ie. "/next-page.html" -> https://host.com/this-book/next-page.html
   */
  private makeUrl(relativeUrl: string): string {
    return new URL(relativeUrl, this.manifest.metadata.identifier).href;
  }
}
