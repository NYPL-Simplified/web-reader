import React, { useState } from 'react';
import {
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { Navigator, ReaderState, WebpubManifest } from '../types';
import Button from './Button';
import { HEADER_HEIGHT } from './Header';
import useColorModeValue from './hooks/useColorModeValue';

type TocItemProps = React.ComponentPropsWithoutRef<typeof MenuItem> & {
  href: string;
  title: string | undefined;
  isActive: boolean;
  onClickHandler: (evt: any) => void;
};

const TocItem = (props: TocItemProps) => {
  const { href, title, isActive, onClickHandler, ...rest } = props;

  const bgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const color = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const activeHover = useColorModeValue('ui.white', 'ui.white', 'ui.sepia');
  const borderColor = useColorModeValue(
    'ui.gray.medium',
    'gray.500',
    'yellow.600'
  );

  const activeColor = 'ui.black';
  const activeBgColor = 'ui.gray.light-cool';

  const _hover = {
    textDecoration: 'none',
    background: isActive ? bgColor : 'ui.gray.x-dark',
    color: isActive ? color : activeHover,
  };

  const _focus = {
    ..._hover,
    boxShadow: 'none',
    background: isActive ? bgColor : 'ui.gray.x-dark',
  };

  const styles = {
    background: isActive ? activeBgColor : bgColor,
    color: isActive ? activeColor : color,
    borderBottom: `1px solid`,
    borderColor: borderColor,
    py: 3,
    _hover,
    _focus,
  };

  return (
    <MenuItem
      as={Link}
      href={href}
      onClick={onClickHandler}
      {...styles}
      {...rest}
    >
      {title}
    </MenuItem>
  );
};

export default function TableOfContent({
  navigator,
  manifest,
  readerState,
}: {
  navigator: Navigator;
  manifest: WebpubManifest;
  readerState: ReaderState;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tocLinkHandler = (evt: any) => {
    evt.preventDefault();
    navigator.goToPage(evt.target.getAttribute('href'));
    setIsOpen(false);
  };

  const tocBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');

  return (
    <Menu
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)} // To account for "close by lose focus"
    >
      <MenuButton as={Button} border="none">
        <Icon decorative name={IconNames.download} modifiers={['small']} />
        <Text variant="headerNav">Table of Contents</Text>
      </MenuButton>
      {isOpen && manifest?.toc && (
        <Portal>
          <MenuList
            width="100vw"
            height={`calc(100vh - ${HEADER_HEIGHT}px)`}
            background={tocBgColor}
            borderRadius="none"
            borderColor={tocBgColor}
            zIndex="popover"
            px={7}
            mt="-2px" // Move the popover slightly higher to hide Header border
            overflow="auto"
          >
            {manifest.toc.map((content) => (
              <React.Fragment key={content.title}>
                <TocItem
                  href={content.href}
                  title={content.title}
                  isActive={readerState?.currentTocUrl === content.href}
                  onClickHandler={tocLinkHandler}
                />
                {content.children &&
                  content.children.map((subLink) => (
                    <TocItem
                      key={subLink.title}
                      href={subLink.href}
                      title={subLink.title}
                      isActive={readerState?.currentTocUrl === subLink.href}
                      onClickHandler={tocLinkHandler}
                      pl={10}
                    />
                  ))}
              </React.Fragment>
            ))}
          </MenuList>
        </Portal>
      )}
    </Menu>
  );
}
