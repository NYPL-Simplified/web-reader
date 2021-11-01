import { Page } from 'react-pdf';
import { chakra, shouldForwardProp } from '@chakra-ui/react';

// Wrap Page component so that we can pass it styles
const ChakraPage = chakra(Page, {
  shouldForwardProp: (prop) => {
    // Definitely forward width and height
    if (['width', 'height', 'scale'].includes(prop)) return true;
    // don't forward the rest of Chakra's props
    const isChakraProp = !shouldForwardProp(prop);
    if (isChakraProp) return false;
    // else, only forward `sample` prop
    return true;
  },
  baseStyle: {
    outline: '1px',
    outlineColor: 'ui.gray.light-cool',
  },
});

export default ChakraPage;
