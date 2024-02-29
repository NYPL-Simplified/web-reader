const SkipNavigation = {
  baseStyle: {
    // Don't display links by default...
    a: {
      backgroundColor: 'ui.white',
      height: '1px',
      left: '-10000px',
      overflow: 'hidden',
      position: 'absolute',
      top: 'auto',
      width: '1px',
      // Only display when the user focuses on the links.
      _focus: {
        height: 'auto',
        left: '2',
        paddingX: '2',
        paddingY: '1',
        top: '2',
        width: 'auto',
      },
    },
  },
};

export default SkipNavigation;
