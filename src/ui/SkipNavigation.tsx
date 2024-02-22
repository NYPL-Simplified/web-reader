import { Box, Link, useStyleConfig } from '@chakra-ui/react';
import React from 'react';

/**
 * SkipNavigation is a component that is used to provide a link
 * used to skip to the main content of the page using the `#mainContent`
 * id. This link is visually hidden but can be read by screenreaders.
 */
export const SkipNavigation = (): React.ReactElement => {
  const styles = useStyleConfig('SkipNavigation');

  return (
    <Box as="nav" aria-label="Skip to Main Content" __css={styles}>
      <Link href="#mainContent" textDecoration="none">
        Skip to Main Content
      </Link>
    </Box>
  );
};

export default SkipNavigation;
