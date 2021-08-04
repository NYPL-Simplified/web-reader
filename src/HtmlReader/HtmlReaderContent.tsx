import * as React from 'react';

const HtmlReaderContent = () => {
  return (
    <div id="D2Reader-Container">
      <main tabIndex={-1} id="iframe-wrapper">
        <div id="reader-loading" className="loading"></div>
        <div id="reader-error" className="error"></div>
      </main>
    </div>
  );
};

export default HtmlReaderContent;
