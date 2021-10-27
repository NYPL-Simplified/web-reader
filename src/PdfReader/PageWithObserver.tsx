import React, { useState, useCallback, FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useIntersectionObserver } from '@wojtekmaj/react-hooks';
import ChakraPage from './ChakraPage';

type PageWithObserverProps = {
  pageNumber: number;
  visible: boolean;
  setPageVisibility: (pageNumber: number, isIntersecting: boolean) => void;
  width: number | undefined;
  scale: number;
};

const observerConfig = {
  // How much of the page needs to be visible to consider page visible
  threshold: 0,
};

const PageWithObserver: FC<PageWithObserverProps> = ({
  visible,
  setPageVisibility,
  pageNumber,
  width,
  scale,
}): JSX.Element => {
  const [page, setPage] = useState();

  const onIntersectionChange = useCallback(
    ([entry]) => {
      setPageVisibility(pageNumber, entry.isIntersecting);
    },
    [pageNumber, setPageVisibility]
  );

  useIntersectionObserver(page, observerConfig, onIntersectionChange);

  return (
    <>
      {visible ? (
        <ChakraPage
          key={`page_key_${pageNumber}`}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          canvasRef={setPage}
          pageNumber={pageNumber}
          width={width}
          scale={scale}
        />
      ) : (
        <div>Placeholder</div>
      )}
    </>
  );
};

export default PageWithObserver;
