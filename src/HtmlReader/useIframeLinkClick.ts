import React from 'react';
import { HtmlAction } from './types';

export default function useIframeLinkClick(
  dispatch: React.Dispatch<HtmlAction>
): void {
  React.useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      if (typeof data === 'object' && data !== null && 'type' in data) {
        switch (data.type) {
          case 'LINK_CLICKED':
            dispatch({ type: 'GO_TO_HREF', href: data.href });
        }
      }
    });
  }, [dispatch]);
}
