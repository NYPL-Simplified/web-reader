import { EPUBExtensionLinkProperties } from './EpubExtension';
import { OPDSLinkProperties } from './OPDSLink';
import { PresentationHintsLinkProperties } from './PresentationHints';

export interface ReadiumLink {
  /**
   * URI or URI template of the linked resource
   */
  href: string;
  /**
   * MIME type of the linked resource
   */
  type?: string;
  /**
   * Indicates that a URI template is used in href
   */
  templated?: boolean;
  /**
   * Title of the linked resource
   */
  title?: string;
  /**
   * Relation between the linked resource and its containing collection
   */
  rel?: string | string[];
  /**
   * Properties associated to the linked resource
   */
  properties?: OPDSLinkProperties &
    EPUBExtensionLinkProperties &
    PresentationHintsLinkProperties;
  /**
   * Height of the linked resource in pixels
   */
  height?: number;
  /**
   * Width of the linked resource in pixels
   */
  width?: number;
  /**
   * Bitrate of the linked resource in kbps
   */
  bitrate?: number;
  /**
   * Length of the linked resource in seconds
   */
  duration?: number;
  /**
   * Expected language of the linked resource
   */
  language?: string | string[];
  /**
   * Alternate resources for the linked resource
   */
  alternate?: ReadiumLink[];
  /**
   * Resources that are children of the linked resource, in the context of a given collection role
   */
  children?: ReadiumLink[];
  [k: string]: unknown;
}
