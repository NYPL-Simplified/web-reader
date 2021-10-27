import React, { FC } from 'react';
import ChakraPage from './ChakraPage';
import { useInView } from 'react-intersection-observer';

type ScrollPageProps = {
  pageNumber: number;
  width: number | undefined;
  height: number | undefined;
  scale: number;
};

type PlaceholderProps = {
  width: number | undefined;
  scale: number | undefined;
};

const Placeholder: FC<PlaceholderProps> = ({ height, width, scale }) => {
  if (height && width && scale) {
    // const currentWidth = scale * width;
    // const currentHeight = scale * height;
    return <div style={{ width: width, height: height }} />;
  }
};

const ScrollPage: FC<ScrollPageProps> = ({
  scale,
  pageNumber,
  width,
  height,
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <ChakraPage pageNumber={pageNumber} scale={scale} width={width} />
      ) : (
        <Placeholder width={width} scale={scale} height={height} />
      )}
    </div>
  );
};

export default ScrollPage;
