import { ConformsTo } from './ConformsTo';
import { Contributor } from './Contributor';
import { EPUBExtensionMetadata } from './EpubExtension';
import { LanguageMap } from './LanguageMap';
import { Subject } from './Subject';

export interface Metadata extends Contributors, EPUBExtensionMetadata {
  identifier?: string;
  '@type'?: string;
  conformsTo?: ConformsTo;
  title: LanguageMap;
  subtitle?: LanguageMap;
  modified?: string;
  published?: {
    [k: string]: unknown;
  } & string;
  /**
   * The language must be a valid BCP 47 tag.
   */
  language?: string | string[];
  sortAs?: LanguageMap;
  subject?: Subject;
  readingProgression?: 'rtl' | 'ltr' | 'ttb' | 'btt' | 'auto';
  description?: string;
  duration?: number;
  numberOfPages?: number;
  belongsTo?: {
    collection?: Contributor;
    series?: Contributor;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface Contributors {
  author?: Contributor;
  translator?: Contributor;
  editor?: Contributor;
  artist?: Contributor;
  illustrator?: Contributor;
  letterer?: Contributor;
  penciler?: Contributor;
  colorist?: Contributor;
  inker?: Contributor;
  narrator?: Contributor;
  contributor?: Contributor;
  publisher?: Contributor;
  imprint?: Contributor;
}
