import * as React from 'react';

const HtmlReaderContent = () => {
  return (
    <div style={{ height: '100%', overflow: 'hidden', width: '100%' }}>
      <div id="D2Reader-Container">
        <main
          style={{ height: 'calc(100vh - 100px)' }}
          tabIndex={-1}
          id="iframe-wrapper"
        >
          <div id="reader-loading" className="loading"></div>
          <div id="reader-error" className="error"></div>
        </main>
      </div>
    </div>
  );
};

export default HtmlReaderContent;
