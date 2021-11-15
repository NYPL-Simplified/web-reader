import * as React from 'react';

const HtmlReaderContent: React.FC<{
  height: string;
  isScrolling: boolean;
  growsWhenScrolling: boolean;
}> = ({ height, isScrolling, growsWhenScrolling }) => {
  const shouldGrow = isScrolling && growsWhenScrolling;
  return (
    <div id="D2Reader-Container">
      <main
        tabIndex={-1}
        id="iframe-wrapper"
        style={{
          /**
           * This determines the height of the iframe.
           *
           * If we remove this, then in scrolling mode it simply grows to fit
           * content. In paginated mode, however, we must have this set because
           * we have to decide how big the content should be.
           */
          height: shouldGrow ? 'initial' : height,
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
