import { WebpubManifest } from '../../src/types';

export const MockWebpubManifest = {
  readingOrder: [
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap0000.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00001.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap0002.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00003.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00003-1.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00004-1.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00004-2.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00004-2-1.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00004-3-1.html',
    },
  ],
  toc: [
    {
      title: 'Chapter 1',
      href: 'chapter/one/url',
    },
    {
      title: 'Chapter 2',
      href: 'chapter/two/url',
    },
    {
      title: 'Chapter 3',
      href: 'chapter/three/url',
      children: [
        {
          title: 'Chapter 3 part 1',
          href: 'chapter/three_one/url',
        },
      ],
    },
    {
      title: 'Chapter 4',
      href: '',
      children: [
        {
          title: 'Chapter 4 part 1',
          href: 'chapter/four/one/url',
        },
        {
          title: 'Chapter 4 part 2',
          href: 'chapter/four/two/url',
          children: [
            {
              title: 'Chapter 4 part 2.1',
              href: 'chapter/four/two/one/url',
            },
          ],
        },
        {
          title: 'Chapter 4 part 3',
          href: '',
          children: [
            {
              title: 'Chapter 4 part 3.1',
              href: 'chapter/four/three/one/url',
            },
          ],
        },
      ],
    },
  ],
} as WebpubManifest;
