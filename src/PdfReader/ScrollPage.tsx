import React, { FC, useEffect, useState } from 'react';
import ChakraPage from './ChakraPage';
import { useInView } from 'react-intersection-observer';

type ScrollPageProps = {
  index: number;
  width: number | undefined;
  scale: number;
  onLoadSuccess: (page: any) => void;
  placeholderHeight: number;
  placeholderWidth: number;
};

type PlaceholderProps = {
  height: number;
  width: number | undefined;
  pageNumber: number;
};

type PagesToRender = boolean;

const Placeholder: FC<PlaceholderProps> = ({ width, height, pageNumber }) => {
  return (
    <div
      data-page-number={pageNumber}
      style={{ width: width, height: height }}
    />
  );
};

const ScrollPage: FC<ScrollPageProps> = ({
  scale,
  index,
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
          pageNumber={index + 1}
          scale={scale}
          width={width}
          onLoadSuccess={onLoadSuccess}
        />
      ) : (
        <Placeholder
          width={placeholderWidth}
          height={placeholderHeight}
          pageNumber={index + 1}
        />
      )}
    </div>
  );
};

export default ScrollPage;
