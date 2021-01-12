import { ManifestMetadata, PdfManifest, Spine, WebpubManifest } from './types';

abstract class ReaderClient<TManifest> {
  constructor(readonly manifest: TManifest) {}

  abstract get startUrl(): string;
  abstract get metadata(): ManifestMetadata;
}

export class EpubClient extends ReaderClient<WebpubManifest> {
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

export class PdfClient extends ReaderClient<PdfManifest> {
  get startUrl(): string {
    return this.manifest.spine[0].href;
  }

  get metadata(): ManifestMetadata {
    return this.manifest.metadata;
  }
  get spine(): Spine<'application/pdf'> {
    return this.manifest.spine;
  }
  contentFor(chapter: number): string {
    const ch = this.manifest.spine[chapter];
    if (!ch) throw new Error(`No Chapter ${chapter}`);
    return ch.href;
  }
}
