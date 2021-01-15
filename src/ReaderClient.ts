export default interface ReaderClient {
  // abstract init(entrypoint: string): Promise<ReaderClient>;

  startUrl: string;
  title: string;
  author: string;

  totalChapters: number;
}
