import * as Comlink from 'comlink';
import createChapterDecryptor from './decryptor';

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

export default Comlink.wrap<typeof createChapterDecryptor>(worker);
