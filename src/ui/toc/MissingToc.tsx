import { Box } from '@chakra-ui/react';
import React from 'react';

export const MissingToc = ({
  children,
}: {
  children: string | React.ReactElement;
}): React.ReactElement => {
  return (
    <Box
      d="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      maxHeight="100vmin"
    >
      {children}
    </Box>
  );
};
