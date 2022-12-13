import { pdfjs } from 'react-pdf';

type PdfTocItem = {
  title: string;
  pageNumber: number;
};

/**
 * Retrieve TOC data from single-resource PDF using PDF.js
 * @param proxiedUrl
 * @returns {PdfTocItem} array from resolving Promise
 */
export default async function generateSinglePdfToc(
  proxiedUrl: string
): Promise<PdfTocItem[]> {
  const tocItems: PdfTocItem[] = [];
  try {
    const pdf = await pdfjs.getDocument(proxiedUrl).promise;
    const outline = await pdf.getOutline(); // get the TOC outline

    if (outline) {
      // iterate through each chapter
      for (let i = 0; i < outline.length; i++) {
        const dest = outline[i].dest;
        if (dest && dest.length > 0) {
          // get the page referance
          const ref = dest[0];
          const pageIndex = await pdf.getPageIndex(ref);
          if (pageIndex) {
            tocItems.push({
              title: outline[i].title,
              pageNumber: pageIndex + 1,
            });
          }
        }
      }
    }
  } catch (e) {
    console.error(e); // todo: add error handling
  }

  return Promise.all(tocItems);
}
