import {
  WebpubDecryptor,
  WebpubDecryptorParams,
} from '@nypl-simplified-packages/axisnow-access-control-web';

export default async function createChapterDecryptor(
  params: WebpubDecryptorParams
): Promise<(url: string) => Promise<string>> {
  const decryptor = await WebpubDecryptor.createDecryptor(params);
  return decryptor.decryptResource;
}
