import * as React from 'react';
import { HEADER_HEIGHT } from '../ui/constants';

const HtmlReaderContent: React.FC = () => {
  return (
    <div id="D2Reader-Container">
      <main
        tabIndex={-1}
        id="iframe-wrapper"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflow: 'hidden',
        }}
      >
        <div id="reader-loading" className="loading"></div>
        <div id="reader-error" className="error"></div>
      </main>
    </div>
  );
};

export default HtmlReaderContent;
