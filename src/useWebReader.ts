import React from 'react';
import EpubClient from './epub/EpubClient';
import PdfClient from './pdf/PdfClient';
import ReaderClient from './ReaderClient';
import { AnyFormat, PdfMimeType, EpubMimeType } from './types';

export type UseWebReaderReturn = {
  chapter: number;
  page: number;
  client: ReaderClient | null;
  handleNextChapter: () => void;
  handlePrevChapter: () => void;
};

type UseWebReaderProps = {
  entrypoint: string;
  format: AnyFormat;
};

export default function useWebReader({
  entrypoint,
  format,
}: UseWebReaderProps): UseWebReaderReturn {
  const [client, setClient] = React.useState<ReaderClient | null>(null);
  const [chapter, setChapter] = React.useState(0);
  const [page, setPage] = React.useState(0);

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

  return {
    client,
    chapter,
    page,
    handleNextChapter,
    handlePrevChapter,
  };
}
