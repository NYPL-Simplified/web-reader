export interface PresentationHintsMetadata {
  presentation?: {
    /**
     * Specifies whether or not the parts of a linked resource that flow out of the viewport are clipped.
     */
    clipped?: boolean;
    /**
     * Indicates if consecutive linked resources from the `reading order` should be handled in a continuous or discontinuous way.
     */
    continuous?: boolean;
    /**
     * Specifies constraints for the presentation of a linked resource within the viewport.
     */
    fit?: 'width' | 'height' | 'contain' | 'cover';
    /**
     * Suggested orientation for the device when displaying the linked resource.
     */
    orientation?: 'auto' | 'landscape' | 'portrait';
    /**
     * Indicates if the overflow of linked resources from the `readingOrder` or `resources` should be handled using dynamic pagination or scrolling.
     */
    overflow?: 'auto' | 'paginated' | 'scrolled' | 'scrolled-continuous';
    /**
     * Indicates the condition to be met for the linked resource to be rendered within a synthetic spread.
     */
    spread?: 'auto' | 'both' | 'none' | 'landscape';
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface PresentationHintsLinkProperties {
  /**
   * Specifies whether or not the parts of a linked resource that flow out of the viewport are clipped.
   */
  clipped?: boolean;
  /**
   * Specifies constraints for the presentation of a linked resource within the viewport.
   */
  fit?: 'contain' | 'cover' | 'width' | 'height';
  /**
   * Suggested orientation for the device when displaying the linked resource.
   */
  orientation?: 'auto' | 'landscape' | 'portrait';
  /**
   * Indicates how the linked resource should be displayed in a reading environment that displays synthetic spreads.
   */
  page?: 'left' | 'right' | 'center';
  /**
   * Indicates the condition to be met for the linked resource to be rendered within a synthetic spread.
   */
  spread?: 'auto' | 'both' | 'none' | 'landscape';
  [k: string]: unknown;
}
