import React from 'react';

type Size = {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
};

export default function useSize(
  ref: React.MutableRefObject<HTMLElement>
): Size | null {
  const [size, setSize] = React.useState<Size | null>(null);

  const observer = React.useRef(
    new ResizeObserver((entries) => {
      // Only care about the first element, we expect one element ot be watched
      setSize(entries[0].contentRect);
    })
  );

  React.useEffect(() => {
    if (ref.current) {
      observer.current.observe(ref.current);
    }

    return () => {
      observer.current.unobserve();
    };
  }, [ref, observer]);

  return size;
}
