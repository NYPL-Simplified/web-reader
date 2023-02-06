import { pdfjs } from 'react-pdf';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import { WebpubManifest } from '../types';

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
    const tocPromises = outline.map(async (chapter) => {
      const dest = chapter.dest;
      if (dest && dest.length > 0) {
        // get the page referance
        const ref = dest[0];
        const pageIndex = await pdf.getPageIndex(ref);
        if (pageIndex) {
          const link: ReadiumLink = {
            title: chapter.title,
            href: `${pdfUrl}#page=${pageIndex.num + 1}`,
            children: [],
          };
          return link;
        }
      }
      return undefined;
    });
    // await all the promises and filter any undefined values (tere was no chapter.dest or pageIndex)
    const toc = (await Promise.all(tocPromises)).filter(
      (item): item is ReadiumLink => !!item
    );
    if (toc.length > 0) {
      manifest.toc = toc;
    }
  } catch (e) {
    console.error(e); // todo: add error handling
  }

  return manifest;
}
