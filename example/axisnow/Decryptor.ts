import * as Comlink from 'comlink';
import { default as DecryptorClass } from '@nypl-simplified-packages/axisnow-access-control-web';

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

const Decryptor = Comlink.wrap<typeof DecryptorClass>(worker);

export default Decryptor;
