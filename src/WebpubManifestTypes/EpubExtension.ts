export interface EPUBExtensionLinkProperties {
  /**
   * Identifies content contained in the linked resource, that cannot be strictly identified using a media type.
   */
  contains?: ('mathml' | 'onix' | 'remote-resources' | 'js' | 'svg' | 'xmp')[];
  /**
   * Hints how the layout of the resource should be presented
   */
  layout?: 'fixed' | 'reflowable';
  /**
   * Indicates that a resource is encrypted/obfuscated and provides relevant information for decryption
   */
  encrypted?: {
    /**
     * Identifies the algorithm used to encrypt the resource
     */
    algorithm: string;
    /**
     * Compression method used on the resource
     */
    compression?: string;
    /**
     * Original length of the resource in bytes before compression and/or encryption
     */
    originalLength?: number;
    /**
     * Identifies the encryption profile used to encrypt the resource
     */
    profile?: string;
    /**
     * Identifies the encryption scheme used to encrypt the resource
     */
    scheme?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface EPUBExtensionMetadata {
  presentation?: {
    /**
     * Hints how the layout of the resource should be presented
     */
    layout?: 'fixed' | 'reflowable';
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
