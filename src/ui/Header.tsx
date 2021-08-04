import React from 'react';
import { Flex, Link, HStack, Text } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { ReaderState, Navigator, WebpubManifest } from '../types';
import useColorModeValue from '../ui/hooks/useColorModeValue';

import SettingsCard from './SettingsButton';
import Button from './Button';
import TableOfContent from './TableOfContent';

export type HeaderProps = {
  headerLeft?: React.ReactNode; // Top-left header section
  readerState: ReaderState;
  navigator: Navigator;
  manifest: WebpubManifest;
};

export default function Header(props: HeaderProps) {
  const { headerLeft, readerState, navigator, manifest } = props;
  const linkColor = useColorModeValue('gray.700', 'gray.100', 'gray.700');
  const mainBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  return (
    <Flex
      alignContent="space-between"
      alignItems="center"
      py={2}
      px={8}
      borderBottom="1px solid"
      borderColor="gray.100"
      bgColor={mainBgColor}
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
          d="flex"
          color={linkColor}
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
        <Button border="none">
          <Icon decorative name={IconNames.search} modifiers={['small']} />
          <Text variant="headerNav">Toggle Fullscreen</Text>
        </Button>
      </HStack>
    </Flex>
  );
}
