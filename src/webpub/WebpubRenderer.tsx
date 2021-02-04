import React, { FC } from 'react';

export type WebpubRendererProps = {
  content: string;
};

const WebpubRenderer: FC<WebpubRendererProps> = ({ content }) => {
  const iframeElement = React.useRef<HTMLIFrameElement>(null);

  /**
   * Set up event listeners in the iframe so we can track state in the
   * manager
   */
  React.useEffect(() => {
    console.log('running', iframeElement.current);
    function willNavigate(e: BeforeUnloadEvent) {
      console.log('navigating', e);
    }
    iframeElement.current?.contentDocument?.body.addEventListener(
      'beforeUnload',
      willNavigate
    );
  }, [iframeElement]);

  return (
    <iframe
      ref={iframeElement}
      // sandbox="allow-same-origin"
      src={content}
      title="Hi"
      style={{
        flex: 1,
        border: 'none',
        backgroundColor: 'white',
      }}
    />
  );
};

export default WebpubRenderer;
