import { Box, Flex, Skeleton, SkeletonText } from '@chakra-ui/react';
import React from 'react';
import { HeaderWrapper } from './Header';

export default function LoadingSkeleton({
  height,
}: {
  height: string;
}): JSX.Element {
  return (
    <>
      <HeaderWrapper />
      <Box
        padding="6"
        bg="white"
        mt="7"
        height={height}
        aria-label="Loading book..."
        aria-busy="true"
        role="progressbar"
      >
        <Flex justifyContent="center">
          <Skeleton height="20px" mb="7" w="30%" />
        </Flex>
        <SkeletonText mb="7" noOfLines={10} spacing="4" />
        <SkeletonText mb="7" noOfLines={5} spacing="4" />
      </Box>
    </>
  );
}
