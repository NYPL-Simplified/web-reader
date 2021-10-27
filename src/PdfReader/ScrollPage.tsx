import React, { FC } from 'react';
import ChakraPage from './ChakraPage';
import { useInView } from 'react-intersection-observer';

type ScrollPageProps = {
  pageNumber: number;
  width: number | undefined;
  scale: number;
  onLoadSuccess: (page: any) => void;
  placeholderHeight: number;
  placeholderWidth: number;
};

type PlaceholderProps = {
  height: number;
  width: number | undefined;
};

const Placeholder: FC<PlaceholderProps> = ({ width, height }) => {
  return <div style={{ width: width, height: height }} />;
};

const ScrollPage: FC<ScrollPageProps> = ({
  scale,
  pageNumber,
  width,
  onLoadSuccess,
  placeholderHeight,
  placeholderWidth,
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <ChakraPage
          pageNumber={pageNumber}
          scale={scale}
          width={width}
          onLoadSuccess={onLoadSuccess}
        />
      ) : (
        <Placeholder width={placeholderWidth} height={placeholderHeight} />
      )}
    </div>
  );
};

export default ScrollPage;
