import { ManifestMetadata, PdfManifest, Spine, WebpubManifest } from './types';

export default abstract class ReaderClient<TManifest> {
  constructor(readonly manifest: TManifest) {}

  abstract get startUrl(): string;
  abstract get metadata(): ManifestMetadata;
}
