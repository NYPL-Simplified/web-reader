/* eslint-disable @typescript-eslint/no-explicit-any */
import { pdfjs } from 'react-pdf';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import { WebpubManifest } from '../types';

const addTocItem = async (
  pdf: any,
  outline: any[],
  pdfUrl: string,
  tocItems: ReadiumLink[]
): Promise<ReadiumLink[]> => {
  // iterate through each chapter
  for (let i = 0; i < outline.length; i++) {
    const chapter = outline[i];
    const dest = chapter.dest;
    if (dest && dest.length > 0) {
      // get the page referance
      const ref = dest[0];
      const pageIndex = await pdf.getPageIndex(ref);
      // TODO: Uncomment subchapter handling when goToPage is updated
      // let subChapters: ReadiumLink[] = [];
      // const outlineChildren = chapter.items;
      // if (outlineChildren.length > 0) {
      //   subChapters = await addTocItem(pdf, outlineChildren, pdfUrl, []);
      // }
      if (pageIndex) {
        tocItems.push({
          title: chapter.title,
          href: `${pdfUrl}#page=${pageIndex + 1}`,
          children: [], // TODO: replace with subChapters when goToPage is updated
        });
      }
    }
  }
  return Promise.all(tocItems);
};

/**
 * Adds TOC data to Webpub Manifest from single-resource PDF using PDF.js
 * @param manifest
 * @param proxiedUrl
 * @returns {WebpubManifest} manifest object
 */
export default async function addTocToManifest(
  manifest: WebpubManifest,
  proxiedUrl: string
): Promise<WebpubManifest> {
  const pdfUrl = manifest.readingOrder[0].href;
  try {
    const pdf = await pdfjs.getDocument(proxiedUrl).promise;
    const outline = await pdf.getOutline(); // get the TOC outline
    let toc: ReadiumLink[] = [];
    if (outline) {
      toc = await addTocItem(pdf, outline, pdfUrl, []);
    }
    if (toc.length > 0) {
      manifest.toc = toc;
    }
  } catch (e) {
    console.error(e); // todo: add error handling
  }

  return manifest;
}
