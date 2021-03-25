import Decryptor from '@nypl-simplified-packages/axisnow-access-control-web';
import { GetContent } from './types';

export async function initDecryptor(): Promise<Decryptor> {
  const params = {
    book_vault_uuid: 'F58373FB-6574-45E6-B50E-6D73523AFD01',
    isbn: '9781467784870',
  };
  return await Decryptor.createDecryptor(params);
}

/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function ab2str(buf: Iterable<number>) {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(new Uint8Array(buf));
}

// a function that builds a getContent function with a decryptor.
export const makeGetContent = (decryptor: Decryptor): GetContent => async (
  href: string
): Promise<string> => {
  // the href is the readingOrder href, which we use to know which
  // resource we need to fetch and decrypt
  const result = await fetch(href);
  const blob = await result.blob();
  const blobUrl = URL.createObjectURL(blob);
  const decrypted = await decryptor.decryptUrl(blobUrl);
  URL.revokeObjectURL(blobUrl);
  const html = new DOMParser().parseFromString(
    ab2str(decrypted),
    'application/xhtml+xml'
  ).documentElement;
  console.log(html);
  return ab2str(decrypted);
};
