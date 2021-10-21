import React, { ComponentProps } from 'react';
import { Flex, Link, HStack, Text, Icon } from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';
import { ActiveReader, ReaderManagerArguments } from '../types';
import useColorModeValue from '../ui/hooks/useColorModeValue';

import SettingsCard from './SettingsButton';
import Button from './Button';
import TableOfContent from './TableOfContent';
import { HEADER_HEIGHT } from './constants';
import { MdOutlineFullscreenExit, MdOutlineFullscreen } from 'react-icons/md';
import useFullscreen from './hooks/useFullScreen';

export const DefaultHeaderLeft = (): React.ReactElement => {
  const linkColor = useColorModeValue('gray.700', 'gray.100', 'gray.700');
  return (
    <Link
      href="/"
      aria-label="Return to Homepage"
      tabIndex={0}
      fontSize={0}
      py={1}
      textTransform="uppercase"
      d="flex"
      color={linkColor}
      height="100%"
      alignItems="center"
      _hover={{
        textDecoration: 'none',
      }}
    >
      <Icon as={MdHome} w={6} h={6} />
      <Text paddingLeft={2} variant="headerNav">
        Back to Homepage
      </Text>
    </Link>
  );
};

export default function Header(
  props: ActiveReader & ReaderManagerArguments
): React.ReactElement {
  const [isFullscreen, toggleFullScreen] = useFullscreen();
  const { headerLeft, state, navigator, manifest } = props;
  const mainBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');

  return (
    <HeaderWrapper bgColor={mainBgColor}>
      {headerLeft ?? <DefaultHeaderLeft />}
      <HStack ml="auto" spacing={1}>
        <TableOfContent
          navigator={navigator}
          manifest={manifest}
          readerState={state}
        />
        <SettingsCard {...props} />
        <Button
          border="none"
          onClick={toggleFullScreen}
          leftIcon={
            <Icon
              as={isFullscreen ? MdOutlineFullscreenExit : MdOutlineFullscreen}
              w={6}
              h={6}
            />
          }
        >
          <Text variant="headerNav">Toggle Fullscreen</Text>
        </Button>
      </HStack>
    </HeaderWrapper>
  );
}

export const HeaderWrapper: React.FC<ComponentProps<typeof Flex>> = ({
  children,
}) => {
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
    >
      {children}
    </Flex>
  );
};
