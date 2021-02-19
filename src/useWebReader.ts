import React from 'react';
import EpubClient from './epub/EpubClient';
import EpubRenderer from './epub/EpubRenderer';
import PdfClient from './pdf/PdfClient';
import PdfRenderer from './pdf/PdfRenderer';
import ReaderClient from './ReaderClient';
import {
  AnyFormat,
  PdfMimeType,
  EpubMimeType,
  EpubLocation,
  PdfLocation,
  AnyClient,
} from './types';

/**
 * Current problem:
 *  We need useWebReader to know what type the client is at any
 *  given time, but the type is determined by the format...
 */

export type UseWebReaderReturn<TClient extends AnyClient, TRenderer> = {
  section: number;
  page: number;
  location: LocationForClient<TClient>;
  client: TClient | null;
  Renderer: TRenderer;
  handleNextPage: () => void;
  handlePrevPage: () => void;
};

type LocationForClient<
  TClient extends PdfClient | EpubClient
> = TClient extends PdfClient ? PdfLocation : EpubLocation;

type ClientForFormat<T extends AnyFormat> = T extends 'application/epub'
  ? EpubClient
  : PdfClient;

export default function useWebReader(
  format: 'application/epub',
  entrypoint: string
): UseWebReaderReturn<EpubClient, typeof EpubRenderer>;
export default function useWebReader(
  format: 'application/pdf+json',
  entrypoint: string
): UseWebReaderReturn<PdfClient, typeof PdfRenderer>;
export default function useWebReader<TClient extends AnyClient>(
  format: AnyFormat,
  entrypoint: string
):
  | UseWebReaderReturn<EpubClient, typeof EpubRenderer>
  | UseWebReaderReturn<PdfClient, typeof PdfRenderer> {
  const [client, setClient] = React.useState<ReaderClient<unknown> | null>(
    null
  );
  const [location, setLocation] = React.useState<unknown>(undefined);

  React.useEffect(() => {
    switch (format) {
      case PdfMimeType:
        PdfClient.init(entrypoint, setLocation).then(setClient);
        break;
      case EpubMimeType:
        EpubClient.init(entrypoint, setLocation).then(setClient);
        break;
      default:
        throw new Error('Unimplemented format: ' + format);
    }
  }, [format, entrypoint]);

  async function handleNextPage() {
    await client?.nextPage();
  }
  async function handlePrevPage() {
    await client?.prevPage();
  }

  // we have to use casting to refine the client type sadly
  if (format === 'application/epub') {
    return {
      client: client as EpubClient | null,
      Renderer: EpubRenderer,
      section: 11,
      page: 0,
      location: location as LocationForClient<EpubClient>,
      handleNextPage,
      handlePrevPage,
    };
  }
  return {
    client: client as PdfClient | null,
    Renderer: PdfRenderer,
    section: 11,
    page: 0,
    location: location as LocationForClient<PdfClient>,
    handleNextPage,
    handlePrevPage,
  };
}
