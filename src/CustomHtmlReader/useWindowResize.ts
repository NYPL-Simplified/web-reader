import React from 'react';
import { HtmlAction } from './types';

/**
 * Simply dispatches an action when the window is resized.
 */
export default function useWindowResize(dispatch: React.Dispatch<HtmlAction>) {
  React.useEffect(() => {
    function handleResize() {
      dispatch({ type: 'WINDOW_RESIZED' });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
}
