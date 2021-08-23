import * as Comlink from 'comlink';
import createChapterDecryptor from './decryptor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const self: WorkerGlobalScope;

/**
 * We need to proxy the decryptChapter function, so we need to re-wrap this up.
 */
const proxiedCreateChapterDecryptor: typeof createChapterDecryptor = async (
  params
) => {
  const decryptChapter = await createChapterDecryptor(params);
  return Comlink.proxy(decryptChapter);
};

Comlink.expose(proxiedCreateChapterDecryptor);
