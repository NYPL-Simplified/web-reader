import React from 'react';
import EpubClient from './epub/EpubClient';
import EpubRenderer from './epub/EpubRenderer';
import PdfClient from './pdf/PdfClient';
import PdfRenderer from './pdf/PdfRenderer';
import { AnyFormat, PdfMimeType, EpubMimeType } from './types';

/**
 * Current problem:
 *  We need the useLocation to use a generic location associated with the client type
 *  but I'm not sure how to extract it out of there
 */

export type UseWebReaderReturn<TClient, TRenderer> = {
  chapter: number;
  page: number;
  client: TClient | null;
  Renderer: TRenderer;
  handleNextChapter: () => void;
  handlePrevChapter: () => void;
};

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
export default function useWebReader(
  format: AnyFormat,
  entrypoint: string
):
  | UseWebReaderReturn<EpubClient, typeof EpubRenderer>
  | UseWebReaderReturn<PdfClient, typeof PdfRenderer> {
  const [client, setClient] = React.useState<ClientForFormat<
    typeof format
  > | null>(null);
  const [chapter, setChapter] = React.useState(0);

  React.useEffect(() => {
    switch (format) {
      case PdfMimeType:
        PdfClient.init(entrypoint).then(setClient);
        break;
      case EpubMimeType:
        EpubClient.init(entrypoint).then(setClient);
        break;
      default:
        throw new Error('Unimplemented format: ' + format);
    }
  }, [format, entrypoint]);

  const handleNextChapter = () => {
    setChapter((ch) => {
      if (!client) return ch;
      if (client.totalChapters === ch) {
        console.warn(`You're on the last chapter.`);
        return ch;
      }
      return ch + 1;
    });
  };
  const handlePrevChapter = () => {
    setChapter((ch) => {
      if (ch === 0) {
        console.warn(`You're on the first chapter.`);
        return ch;
      }
      return ch - 1;
    });
  };

  // we have to use casting to refine the client type sadly
  if (format === 'application/epub') {
    return {
      client: client as EpubClient,
      Renderer: EpubRenderer,
      chapter,
      page: 0,
      handleNextChapter,
      handlePrevChapter,
    };
  }
  return {
    client: client as PdfClient,
    Renderer: PdfRenderer,
    chapter,
    page: 0,
    handleNextChapter,
    handlePrevChapter,
  };
}
