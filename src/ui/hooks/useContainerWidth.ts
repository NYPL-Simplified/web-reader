import { useCallback, useState } from 'react';
import useEventListener from './useEventListener';

/**
 * Returns the interior width of the container in pixels.
 *
 * @returns {number} Width of the container in pixels
 */
export default function useContainerWidth(containerId: string): number {
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  const getContainerWidth = useCallback(() => {
    const el = document.getElementById(containerId);
    if (!el) {
      setContainerWidth(window.innerWidth);
      return;
    }
    setContainerWidth(el.clientWidth);
  }, [containerId]);

  useEventListener(window, 'resize', getContainerWidth);

  return containerWidth;
}
