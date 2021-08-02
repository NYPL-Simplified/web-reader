import React from 'react';
import {
  Flex,
  Link,
  HStack,
  Button as ChakraButton,
  Text,
} from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { ReaderState, Navigator, WebpubManifest } from '../types';
import SettingsCard from './SettingsButton';
import TableOfContent from './TableOfContent';

export type HeaderProps = {
  headerLeft?: React.ReactNode; // Top-left header section
  readerState: ReaderState;
  navigator: Navigator;
  manifest: WebpubManifest;
};

export default function Header(props: HeaderProps) {
  const { headerLeft, readerState, navigator, manifest } = props;

  return (
    <Flex
      alignContent="space-between"
      alignItems="center"
      py={2}
      px={8}
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      {headerLeft ? (
        headerLeft
      ) : (
        <Link
          href="https://www.nypl.org"
          aria-label="Return to NYPL"
          tabIndex={0}
          fontSize={0}
          py={1}
          textTransform="uppercase"
          color="gray.700"
          d="flex"
          alignItems="center"
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Icon decorative name={IconNames.headset} modifiers={['small']} />
          <Text variant="headerNav">Return to NYPL</Text>
        </Link>
      )}
      <HStack ml="auto" spacing={1}>
        <TableOfContent navigator={navigator} manifest={manifest} />
        <SettingsCard navigator={navigator} state={readerState} />
        <ChakraButton variant="headerNav">
          <Icon decorative name={IconNames.search} modifiers={['small']} />
          <Text variant="headerNav">Toggle Fullscreen</Text>
        </ChakraButton>
      </HStack>
    </Flex>
  );
}
