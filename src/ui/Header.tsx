import React, { ComponentProps } from 'react';
import {
  Flex,
  Link,
  HStack,
  Icon,
  IconButton,
  Text,
  useBreakpointValue,
  Spacer,
} from '@chakra-ui/react';

import { ActiveReader, ReaderManagerArguments } from '../types';
import Button from './Button';
import { HEADER_HEIGHT } from '../constants';
import { Previous, ToggleFullScreen, ToggleFullScreenExit } from './icons';
import SettingsCard from './SettingsCard';
import TableOfContent from './TableOfContent';
import useColorModeValue from '../ui/hooks/useColorModeValue';
import useFullscreen from './hooks/useFullScreen';

export const DefaultHeaderLeft = (): React.ReactElement => {
  const iconFill = useColorModeValue(
    'ui.gray.icon',
    'ui.white',
    'ui.gray.icon'
  );

  const breakpointIsSmOrMd = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });

  return (
    <Link
      href="/"
      tabIndex={0}
      _hover={{
        textDecoration: 'none',
      }}
    >
      {breakpointIsSmOrMd ? (
        <IconButton
          aria-label="Go back"
          icon={<Icon as={Previous} fill={iconFill} w={6} h={6} />}
          paddingLeft="3"
          paddingRight="3"
        />
      ) : (
        <Button
          aria-label="Go back"
          border="none"
          leftIcon={<Icon as={Previous} fill={iconFill} w={6} h={6} />}
        >
          <Text variant="headerNav">Back</Text>
        </Button>
      )}
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

  const breakpointIsSmOrMd = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });

  return (
    <HeaderWrapper bg={mainBgColor}>
      {headerLeft ?? <DefaultHeaderLeft />}
      <Spacer />
      <HStack spacing={0}>
        <TableOfContent
          containerRef={containerRef}
          navigator={navigator}
          manifest={manifest}
        />
        <SettingsCard {...props} />
        {breakpointIsSmOrMd ? (
          <IconButton
            aria-label="Toggle full screen"
            icon={
              <Icon
                as={isFullscreen ? ToggleFullScreenExit : ToggleFullScreen}
                fill={iconFill}
                w={6}
                h={6}
              />
            }
            onClick={toggleFullScreen}
            paddingLeft="3"
            paddingRight="3"
            sx={{
              _active: {
                bgColor: mainBgColor,
              },
              _hover: {
                bgColor: mainBgColor,
              },
              _focus: {
                bgColor: mainBgColor,
                ring: '2px',
                ringInset: 'inset',
              },
            }}
          />
        ) : (
          <Button
            aria-expanded={isFullscreen}
            aria-label="Toggle full screen"
            border="none"
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
        )}
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
      borderBottom="1px solid"
      borderColor="gray.100"
      {...rest}
    >
      {children}
    </Flex>
  );
});
