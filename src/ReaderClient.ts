export default interface ReaderClient<TLocation> {
  // cant define a static property on an interface :(
  // abstract init(entrypoint: string): Promise<ReaderClient>;

  // metadata
  title: string;
  author: string;

  // locations
  startLocation: TLocation;
  totalChapters: number;
}
