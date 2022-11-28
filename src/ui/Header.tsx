import React, { ComponentProps } from 'react';
import { Flex, Link, HStack, Text, Icon } from '@chakra-ui/react';
import { ActiveReader, ReaderManagerArguments } from '../types';
import Button from './Button';
import { HEADER_HEIGHT } from '../constants';
import { Previous, ToggleFullScreen, ToggleFullScreenExit } from './icons';
import SettingsCard from './SettingsButton';
import TableOfContent from './TableOfContent';
import useColorModeValue from '../ui/hooks/useColorModeValue';
import useFullscreen from './hooks/useFullScreen';

export const DefaultHeaderLeft = (): React.ReactElement => {
  const linkColor = useColorModeValue('gray.700', 'gray.100', 'gray.700');
  const iconFill = useColorModeValue(
    'ui.gray.icon',
    'ui.white',
    'ui.gray.icon'
  );
  const bgColorFocus = useColorModeValue(
    'ui.gray.active',
    'ui.gray.x-dark',
    'ui.gray.active'
  );

  return (
    <Link
      href="/"
      aria-label="Return to Homepage"
      tabIndex={0}
      fontSize={0}
      px={3}
      py={1}
      d="flex"
      color={linkColor}
      height="100%"
      alignItems="center"
      _hover={{
        textDecoration: 'none',
      }}
      _focus={{
        bgColor: bgColorFocus,
      }}
    >
      <Icon as={Previous} fill={iconFill} w={6} h={6} />
      <Text paddingLeft={2} variant="headerNav">
        Back
      </Text>
    </Link>
  );
};

export default function Header(
  props: ActiveReader &
    ReaderManagerArguments & {
      containerRef: React.MutableRefObject<null | HTMLDivElement>;
    }
): React.ReactElement {
  const [isFullscreen, toggleFullScreen] = useFullscreen();
  const { headerLeft, navigator, manifest, containerRef } = props;
  const iconFill = useColorModeValue(
    'ui.gray.icon',
    'ui.white',
    'ui.gray.icon'
  );
  const mainBgColor = useColorModeValue(
    'ui.gray.light-warm',
    'ui.black',
    'ui.sepia'
  );

  return (
    <HeaderWrapper bg={mainBgColor}>
      {headerLeft ?? <DefaultHeaderLeft />}
      <HStack ml="auto" spacing={1}>
        <TableOfContent
          containerRef={containerRef}
          navigator={navigator}
          manifest={manifest}
        />
        <SettingsCard {...props} />
        <Button
          border="none"
          isMenuButton
          onClick={toggleFullScreen}
          leftIcon={
            <Icon
              as={isFullscreen ? ToggleFullScreenExit : ToggleFullScreen}
              fill={iconFill}
              w={6}
              h={6}
            />
          }
        >
          <Text variant="headerNav">
            {isFullscreen ? 'Full screen exit' : 'Full screen'}
          </Text>
        </Button>
      </HStack>
    </HeaderWrapper>
  );
}

export const HeaderWrapper = React.forwardRef<
  HTMLDivElement,
  ComponentProps<typeof Flex>
>(({ children, ...rest }, ref) => {
  return (
    <Flex
      ref={ref}
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
      {...rest}
    >
      {children}
    </Flex>
  );
});
