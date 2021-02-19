export default interface ReaderClient<TLocation> {
  // cant define a static property on an interface :(
  // abstract init(entrypoint: string): Promise<ReaderClient>;
  /**
   * Note: there is no "ready" property. If the client exists, then it is
   * ready. We use async initializer to set it up for this reason.
   */

  // metadata
  title: string;
  author: string;
  // locations
  startLocation: TLocation;
  /**
   * We could have just a relativeLocation property, which
   * returns either current and total sections or a percent.
   */

  nextPage: () => Promise<TLocation>;
  prevPage: () => Promise<TLocation>;
}
