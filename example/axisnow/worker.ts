import * as Comlink from 'comlink';
import Decryptor from '@nypl-simplified-packages/axisnow-access-control-web';

// type DecryptorParams = {
//   book_vault_uuid: string;
//   idbn: string
// }

// async function getAxisNowContent(href: string, decryptorParams: DecryptorParams}): Promise<string> {
//   const decryptor = await Decryptor.createDecryptor()
//   return '<div>bleh</div>';
// }

Comlink.expose(Decryptor);
