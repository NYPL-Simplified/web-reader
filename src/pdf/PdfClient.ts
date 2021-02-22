import { fetchJson } from '../fetch';
import ReaderClient from '../ReaderClient';
import { PdfLocation, PdfManifest, SetLocation, TocItem } from '../types';
import PdfRenderer from './PdfRenderer';
export default class PdfClient implements ReaderClient<PdfLocation> {
  readonly Renderer = PdfRenderer;
  private constructor(
    readonly manifest: PdfManifest,
    private readonly setLocation: SetLocation<PdfLocation>,
    readonly toc: TocItem[] | undefined
  ) {}

  // an async constructor function that fetches the manifest and then
  // returns a new client using it
  static async init(
    entrypoint: string,
    setLocation: SetLocation<PdfLocation>
  ): Promise<PdfClient> {
    const manifest = await fetchJson(entrypoint);
    return new PdfClient(manifest, setLocation, undefined);
  }

  get startLocation(): number {
    return 0;
  }

  // metadata
  get title(): string {
    return this.manifest.metadata.title;
  }
  get author(): string {
    return this.manifest.metadata.author;
  }

  async nextPage() {
    this.setLocation((current) => {
      if (typeof current !== 'number') return 0;
      // detect end
      if (current >= this.manifest.spine.length - 1) return current;
      return current + 1;
    });
  }
  async prevPage() {
    this.setLocation((current) => {
      if (typeof current !== 'number') return 0;
      if (current === 0) return current;
      return current - 1;
    });
  }
  // content
  contentFor(location: PdfLocation): string {
    const realLoc = location === undefined ? 0 : location;
    const ch = this.manifest.spine[realLoc];
    if (!ch) throw new Error(`No Chapter ${realLoc}`);
    return ch.href;
  }
}
