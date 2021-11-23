import * as React from 'react';

const HtmlReaderContent: React.FC<{
  height: string;
  isScrolling: boolean;
  growsWhenScrolling: boolean;
}> = ({ height }) => {
  return (
    <div id="D2Reader-Container">
      <main
        tabIndex={-1}
        id="iframe-wrapper"
        style={{
          height: height,
          /**
           * We always want the height to be at least the defined height
           */
          minHeight: height,
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
