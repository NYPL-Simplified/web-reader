import * as React from 'react';
import { Text } from '@chakra-ui/react';
import { Locator } from '../Readium/Locator';

export default function Progression({
  location,
}: {
  location?: Locator;
}): JSX.Element | null {
  const { position, remainingPositions } = location?.locations ?? {};
  const totalPages =
    position && typeof remainingPositions === 'number'
      ? position + remainingPositions
      : null;

  if (!position || typeof totalPages !== 'number') return null;

  return (
    <Text display="flex" alignItems="center">
      Page {position} / {totalPages}
    </Text>
  );
}
