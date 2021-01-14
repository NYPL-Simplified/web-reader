import ReaderClient from '../ReaderClient';
import { PdfManifest, ManifestMetadata, Spine } from '../types';

export default class PdfClient extends ReaderClient<PdfManifest> {
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
