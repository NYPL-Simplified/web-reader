import { WebpubManifest } from '../../src/types';

export const MockPdfManifest = {
  context: 'https://drb-files-qa-s3.amazonaws.com/manifests/context.jsonld',
  metadata: {
    '@type': 'https://schema.org/Book',
    title: 'Test Pdf Manifest',
    author: 'Test PDF Author',
    identifier: 'urn:isbn:9780870819704',
    conformsTo: 'http://librarysimplified.org/terms/profiles/pdf',
  },
  links: [
    {
      href: 'https://muse.jhu.edu/book/2691/',
      type: 'text/html',
      rel: 'alternate',
    },
    {
      href:
        'https://drb-files-qa.s3.amazonaws.com/manifests/muse/muse1007.json',
      type: 'application/webpub+json',
      rel: 'self',
    },
  ],
  readingOrder: [
    {
      href: 'resource1/pdf',
      title: 'Cover',
      type: 'application/pdf',
    },
    {
      href: 'resource2/pdf',
      title: 'Title Page, Copyright Page',
      type: 'application/pdf',
    },
    {
      href: 'resource3/pdf',
      title: 'Contents',
      type: 'application/pdf',
    },
    {
      href: 'resource4/pdf',
      title: 'Foreword part 1',
      type: 'application/pdf',
    },
    {
      href: 'resource5/pdf',
      title: 'Foreword part 2',
      type: 'application/pdf',
    },
  ],
  resources: [
    {
      href: 'resource1/pdf',
      type: 'application/pdf',
    },
    {
      href: 'resource2/pdf',
      type: 'application/pdf',
    },
    {
      href: 'resource3/pdf',
      type: 'application/pdf',
    },
    {
      href: 'resource4/pdf',
      type: 'application/pdf',
    },
    {
      href: 'resource5/pdf',
      type: 'application/pdf',
    },
  ],
  toc: [
    {
      href: 'resource1/pdf',
      title: 'Cover',
    },
    {
      href: 'resource2/pdf',
      title: 'Title Page, Copyright Page',
    },
    {
      href: 'resource3/pdf',
      title: 'Contents',
    },
    {
      href: '',
      title: 'Foreword',
      children: [
        {
          href: 'resource4/pdf',
          title: 'Foreword Part 1',
        },
        {
          href: 'resource5/pdf',
          title: 'Foreword Part 2',
        },
      ],
    },
  ],
} as WebpubManifest;
