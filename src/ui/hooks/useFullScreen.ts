import { useCallback, useState } from 'react';

export default function useFullscreen(): [boolean, () => void] {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const updateFullScreenStatus = useCallback(() => {
    setIsFullscreen(!!isOnFullscreen());
  }, []);

  document.addEventListener('fullscreenchange', updateFullScreenStatus);
  document.addEventListener('webkitfullscreenchange', updateFullScreenStatus);
  document.addEventListener('mozfullscreenchange', updateFullScreenStatus);
  document.addEventListener('MSFullscreenChange', updateFullScreenStatus);

  return [isFullscreen, toggleFullScreen];
}

// For Safari IOS: Only available on iPad, not on iPhone.
// https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled#browser_compatibility
export const fullScreenEnabled =
  typeof document !== 'undefined' &&
  !!(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  );

const enterFullScreen = () => {
  if (typeof document === 'undefined') return;
  const docElement = document.documentElement;
  const fullScreenFunc =
    docElement.requestFullscreen ||
    docElement.mozRequestFullScreen ||
    docElement.webkitRequestFullscreen ||
    docElement.msRequestFullscreen;

  if (typeof fullScreenFunc === 'function') {
    fullScreenFunc.call(docElement);
  }
};

const exitFullScreen = () => {
  if (typeof document === 'undefined') return;
  const exitFunc =
    document.exitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  if (typeof exitFunc === 'function') {
    exitFunc.call(document);
  }
};

export const isOnFullscreen = (): boolean => {
  if (typeof document === 'undefined') return false;
  return !!(
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
};

/**
 * Toggles fullscreen mode on the <html> element.
 */
export function toggleFullScreen(): void {
  if (isOnFullscreen()) {
    exitFullScreen();
  } else {
    enterFullScreen();
  }
}
