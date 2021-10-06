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

// Methods for Firefox / Safari / Edge
// We have to cast these types so typescript doesn't complain
interface FullSpecDocument extends Document {
  mozFullScreenElement: Element | null;
  webkitFullscreenElement: Element | null;
  msFullscreenElement: Element | null;
  webkitFullscreenEnabled: boolean;
  mozFullScreenEnabled: boolean;
  msFullscreenEnabled: boolean;
  mozCancelFullScreen: () => Promise<void>;
  webkitExitFullscreen: () => Promise<void>;
  msExitFullscreen: () => Promise<void>;
}

interface FullSpecElement extends HTMLElement {
  mozRequestFullScreen: (options?: FullscreenOptions) => Promise<void>;
  webkitRequestFullscreen: (options?: FullscreenOptions) => Promise<void>;
  msRequestFullscreen: (options?: FullscreenOptions) => Promise<void>;
}

const doc = document as FullSpecDocument;
const docElm = document.documentElement as FullSpecElement;

// For Safari IOS: Only available on iPad, not on iPhone.
// https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled#browser_compatibility
export const fullScreenEnabled =
  doc.fullscreenEnabled ||
  doc.webkitFullscreenEnabled ||
  doc.mozFullScreenEnabled ||
  doc.msFullscreenEnabled;

const enterFullScreen = () => {
  const fullScreenFunc =
    docElm.requestFullscreen ||
    docElm.mozRequestFullScreen ||
    docElm.webkitRequestFullscreen ||
    docElm.msRequestFullscreen;

  if (typeof fullScreenFunc === 'function') {
    fullScreenFunc.call(docElm);
  }
};

const exitFullScreen = () => {
  const exitFunc =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;
  if (typeof exitFunc === 'function') {
    exitFunc.call(doc);
  }
};

export const isOnFullscreen = (() => {
  const doc = document as FullSpecDocument;
  return () =>
    doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement;
})();

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
