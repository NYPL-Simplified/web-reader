import { pdfjs } from 'react-pdf';
import { PdfTocItem } from '../types';

/**
 * Retrieve TOC data from single-resource PDF using PDF.js
 * @param proxiedUrl
 * @returns {PdfTocItem} array from resolving Promise
 */
export default async function generateSinglePdfToc(
  proxiedUrl: string
): Promise<PdfTocItem[]> {
  try {
    const pdf = await pdfjs.getDocument(proxiedUrl).promise;
    const outline = await pdf.getOutline(); // get the TOC outline

    if (outline) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addTocItem = async (
        outline: any[],
        tocItems: PdfTocItem[]
      ): Promise<PdfTocItem[]> => {
        // iterate through each chapter
        for (let i = 0; i < outline.length; i++) {
          const chapter = outline[i];
          const dest = chapter.dest;
          if (dest && dest.length > 0) {
            // get the page referance
            const ref = dest[0];
            const pageIndex = await pdf.getPageIndex(ref);
            let subChapters: PdfTocItem[] = [];
            const outlineChildren = chapter.items;
            if (outlineChildren.length > 0) {
              subChapters = await addTocItem(outlineChildren, []);
            }
            if (pageIndex) {
              tocItems.push({
                title: chapter.title,
                pageNumber: pageIndex + 1,
                children: subChapters,
              });
            }
          }
        }
        return Promise.all(tocItems);
      };

      return await addTocItem(outline, []);
    }
  } catch (e) {
    console.error(e); // todo: add error handling
  }

  return [];
}
