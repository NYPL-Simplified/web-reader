import ReaderClient from '../ReaderClient';
import { EpubManifest, ManifestMetadata, Spine } from '../types';

export default class EpubClient extends ReaderClient<EpubManifest> {
  get startUrl(): string {
    const startPath = this.manifest.spine[0].href;
    return this.makeUrl(startPath);
  }

  get metadata(): ManifestMetadata {
    return this.manifest.metadata;
  }
  get spine(): Spine<'text/html'> {
    return this.manifest.spine;
  }
  contentFor(chapter: number): string {
    const ch = this.manifest.spine[chapter];
    if (!ch) throw new Error(`No Chapter ${chapter}`);
    return this.makeUrl(ch.href);
  }

  /**
   * Take a url relative to the iframe root and turn it into
   * an absolute url including the domain and everything
   * ie. "/next-page.html" -> https://host.com/this-book/next-page.html
   */
  private makeUrl(relativeUrl: string): string {
    return new URL(relativeUrl, this.metadata.identifier).href;
  }
}
