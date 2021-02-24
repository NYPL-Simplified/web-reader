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
    setLocation(manifest.components[0].href);
    return new PdfClient(manifest, setLocation, manifest.table_of_contents);
  }

  get startLocation(): string {
    return this.manifest.components[0].href;
  }

  // metadata
  get title(): string {
    return this.manifest.metadata.title;
  }
  get author(): string {
    return this.manifest.metadata.author;
  }

  async nextPage() {
    console.warn('nextPage not built for pdfs yet');
  }
  async prevPage() {
    console.warn('prevPage not built for pdfs yet');
  }

  async goTo(href: string) {
    this.setLocation(href);
  }
}
