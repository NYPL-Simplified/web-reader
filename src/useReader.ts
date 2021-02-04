export type UseReaderReturn = {
  title: string;
  author: string;
  totalSections: number;
  currentSection: number;
  handleNextSection: () => void;
  handlePrevSection: () => void;
};
