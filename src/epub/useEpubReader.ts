import { UseReaderReturn } from '../useReader';

export default function useEpubReader(entrypoint: string): UseReaderReturn {
  return {
    title: 'blah',
    author: 'bleep',
    currentSection: 0,
    totalSections: 100,
    handleNextSection: () => console.log('next'),
    handlePrevSection: () => console.log('prev'),
  };
}
