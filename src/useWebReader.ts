import React from 'react';
import { PdfClient, EpubClient } from './clients';
import EpubRenderer from './EpubRenderer';
import PdfRenderer from './PdfRenderer';
import { AnyManifest, AnyMimeType, PdfManifest } from './types';

function isPdfManifest(
  manifest: AnyManifest,
  type: AnyMimeType
): manifest is PdfManifest {
  return type === 'application/pdf';
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

export default function useWebReader({
  manifest,
  type,
}: {
  manifest: AnyManifest;
  type: AnyMimeType;
}): UseWebReaderReturn {
  const client = isPdfManifest(manifest, type)
    ? new PdfClient(manifest)
    : new EpubClient(manifest);
  const Renderer = isPdfManifest(manifest, type) ? PdfRenderer : EpubRenderer;

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
