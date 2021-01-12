import React from 'react';
import { PdfClient, EpubClient } from './clients';
import EpubRenderer from './EpubRenderer';
import PdfRenderer from './PdfRenderer';
import { AnyManifest, AnyFormat, PdfManifest } from './types';

function isPdfManifest(
  manifest: AnyManifest,
  format: AnyFormat
): manifest is PdfManifest {
  return format === 'application/pdf';
}

export type UseWebReaderReturn = {
  title: string;
  chapter: number;
  totalChapters: number;
  page: number;
  client: PdfClient | EpubClient;
  Renderer: typeof EpubRenderer | typeof PdfRenderer;
  handleNextChapter: () => void;
  handlePrevChapter: () => void;
};

type UseWebReaderProps = {
  manifest: AnyManifest;
  format: AnyFormat;
};

export default function useWebReader({
  manifest,
  format,
}: UseWebReaderProps): UseWebReaderReturn {
  const client = isPdfManifest(manifest, format)
    ? new PdfClient(manifest)
    : new EpubClient(manifest);
  const Renderer = isPdfManifest(manifest, format) ? PdfRenderer : EpubRenderer;

  const [chapter, setChapter] = React.useState(0);
  const [page, setPage] = React.useState(0);

  const handleNextChapter = () => {
    setChapter((ch) => {
      if (client.spine.length - 1 === ch) {
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
    title: client.metadata.title,
    client,
    Renderer,
    chapter,
    totalChapters: client.spine.length,
    page,
    handleNextChapter,
    handlePrevChapter,
  };
}
