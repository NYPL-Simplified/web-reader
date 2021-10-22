import * as Comlink from 'comlink';
import createChapterDecryptor from './decryptAndEmbed';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const self: WorkerGlobalScope;

/**
 * We need to proxy the decryptChapter function, so we need to re-wrap this up.
 */
const proxiedCreateChapterDecryptor: typeof createChapterDecryptor = async (
  params,
  webpubManifest,
  webpubManifestUrl
) => {
  const decryptChapter = await createChapterDecryptor(
    params,
    webpubManifest,
    webpubManifestUrl
  );
  return Comlink.proxy(decryptChapter);
};

Comlink.expose(proxiedCreateChapterDecryptor);
