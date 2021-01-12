import React, { FC } from 'react';

export type EpubRendererProps = {
  src: string;
};

const EpubRenderer: FC<EpubRendererProps> = ({ src }) => {
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
      src={src}
      title="Hi"
      style={{
        flex: 1,
        border: 'none',
        backgroundColor: 'white',
      }}
    />
  );
};

export default EpubRenderer;
