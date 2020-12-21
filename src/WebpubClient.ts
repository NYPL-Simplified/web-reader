import { ManifestMetadata, WebpubManifest } from './types';

abstract class ReaderClient<TManifest> {
  protected constructor(
    protected readonly manifestUrl: string,
    readonly manifest: TManifest
  ) {}

  abstract get startUrl(): string;
  abstract get metadata(): ManifestMetadata;
}

export default class WebpubClient extends ReaderClient<WebpubManifest> {
  public static async init(manifestUrl: string): Promise<WebpubClient> {
    const manifest = await fetchManifest(manifestUrl);
    return new WebpubClient(manifestUrl, manifest);
  }

  get startUrl(): string {
    const startPath = this.manifest.spine[0].href;
    return this.makeUrl(startPath);
  }

  get metadata(): ManifestMetadata {
    return this.manifest.metadata;
  }

  private makeUrl(relativeUrl: string): string {
    return new URL(relativeUrl, this.manifestUrl).href;
  }
}

async function fetchManifest(url: string) {
  const result = await fetch(url);
  if (!result.ok) throw new Error('Failed to fetch manifest at url: ' + url);
  return await result.json();
}
