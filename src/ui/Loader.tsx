import { Spinner } from '@chakra-ui/react';
import React from 'react';

export default function Loader({ label }: { label?: string }) {
  return (
    <Spinner
      label={label ?? 'Loading'}
      thickness="4px"
      speed="0.65s"
      color="blue.500"
      size="xl"
    />
  );
}
