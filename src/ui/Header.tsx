import React from 'react';
import { Flex, Link, HStack, Text } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { ActiveReader } from '../types';
import useColorModeValue from '../ui/hooks/useColorModeValue';
import { toggleFullScreen } from '../utils/toggleFullScreen';

import SettingsCard from './SettingsButton';
import Button from './Button';
import TableOfContent from './TableOfContent';

export type HeaderProps = ActiveReader & {
  headerLeft?: React.ReactNode; // Top-left header section
};

// we have to set a constant height to make this work with R2D2BC
export const HEADER_HEIGHT = 48;

export default function Header(props: HeaderProps): React.ReactElement {
  const { headerLeft, state, navigator, manifest } = props;
  const linkColor = useColorModeValue('gray.700', 'gray.100', 'gray.700');
  const mainBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      left={0}
      right={0}
      height={`${HEADER_HEIGHT}px`}
      zIndex="sticky"
      alignContent="space-between"
      alignItems="center"
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
        <TableOfContent
          navigator={navigator}
          manifest={manifest}
          readerState={state}
        />
        <SettingsCard {...props} />
        <Button border="none" onClick={toggleFullScreen}>
          <Icon decorative name={IconNames.search} modifiers={['small']} />
          <Text variant="headerNav">Toggle Fullscreen</Text>
        </Button>
      </HStack>
    </Flex>
  );
}
