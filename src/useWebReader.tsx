import React from 'react';
import EpubClient from './epub/EpubClient';
import EpubRenderer from './epub/EpubRenderer';
import PdfClient from './pdf/PdfClient';
import PdfRenderer from './pdf/PdfRenderer';
import {
  AnyFormat,
  PdfMimeType,
  EpubMimeType,
  EpubLocation,
  PdfLocation,
} from './types';

/**
 * Current problem:
 *  We need useWebReader to know what type the client is at any
 *  given time, but the type is determined by the format...
 */

export type UseWebReaderReturn = {
  title: string | null;
  isLoading: boolean;
  renderer: JSX.Element;
  handleNextPage: () => void;
  handlePrevPage: () => void;
};

type LocationForClient<
  TClient extends PdfClient | EpubClient
> = TClient extends PdfClient ? PdfLocation : EpubLocation;

export default function useWebReader(
  format: AnyFormat,
  entrypoint: string
): UseWebReaderReturn {
  const [client, setClient] = React.useState<EpubClient | PdfClient | null>(
    null
  );
  const [location, setLocation] = React.useState<unknown>(undefined);

  const isLoading = !client;
  const title = client?.title ?? null;

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

  /**
   * We sadly have to do these checks because typescript can't narrow the type
   * of location and client properly based on the value of format passed in.
   */
  if (format === 'application/epub') {
    return {
      isLoading,
      title,
      renderer: <EpubRenderer />,
      handleNextPage,
      handlePrevPage,
    };
  }
  if (format === 'application/pdf+json') {
    return {
      isLoading,
      title,
      renderer: (
        <PdfRenderer
          content={(client as PdfClient)?.contentFor(location as PdfLocation)}
        />
      ),
      handleNextPage,
      handlePrevPage,
    };
  }
  throw new Error(
    `useWebReader failed to return. Format ${format} was not recognized.`
  );
}
