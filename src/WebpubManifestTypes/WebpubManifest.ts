/**
 * Type definitions for a manifest
 */
import { ReadiumWebpubContext } from '../constants';
import { Metadata } from './Metadata';
import { ReadiumLink } from './ReadiumLink';

export interface WebpubManifest {
  '@context'?: typeof ReadiumWebpubContext;
  metadata: Metadata;
  links: ReadiumLink[];
  readingOrder: ReadiumLink[];
  resources?: ReadiumLink[];
  toc?: ReadiumLink[];
}
