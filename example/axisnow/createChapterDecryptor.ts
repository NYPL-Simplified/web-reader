export default async function createChapterDecryptor(
  params: unknown
): Promise<null | ((url: string) => Promise<string>)> {
  if (process.env.AXISNOW_VAULT_UUID && process.env.AXISNOW_ISBN) {
    const {
      WebpubDecryptor,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require('@nypl-simplified-packages/axisnow-access-control-web');
    const decryptor = await WebpubDecryptor.createDecryptor(params);
    return decryptor.decryptResource;
  }
  return null;
}
