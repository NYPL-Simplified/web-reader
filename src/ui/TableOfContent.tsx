import React, { useState } from 'react';
import {
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Icon,
} from '@chakra-ui/react';
import { MdOutlineToc, MdOutlineCancel } from 'react-icons/md';
import { Navigator, ReaderState, WebpubManifest } from '../types';
import Button from './Button';
import useColorModeValue from './hooks/useColorModeValue';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';

export default function TableOfContent({
  navigator,
  manifest,
  readerState,
  height,
  growWhenScrolling,
  isScrolling,
}: {
  navigator: Navigator;
  manifest: WebpubManifest;
  readerState: ReaderState;
  height: string;
  isScrolling: boolean;
  growWhenScrolling: boolean;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const tocLinkHandler: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    const href = evt.currentTarget.getAttribute('href');
    if (!href) {
      console.warn('TOC Link clicked without an href');
      return;
    }
    navigator.goToPage(href);
    setIsOpen(false);
  };

  const tocBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');

  const getLinkHref = (link: ReadiumLink): string => {
    if (link.href) return link.href;
    if (!link.children) throw new Error('Manifest is not well formed');
    return getLinkHref(link.children[0]);
  };

  const shouldGrow = isScrolling && growWhenScrolling;
  const finalHeight = shouldGrow ? 'initial' : height;

  return (
    <Menu
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)} // To account for "close by lose focus"
    >
      <MenuButton
        as={Button}
        border="none"
        leftIcon={
          <Icon as={isOpen ? MdOutlineCancel : MdOutlineToc} w={6} h={6} />
        }
      >
        <Text variant="headerNav">Table of Contents</Text>
      </MenuButton>
      {isOpen && manifest?.toc && (
        <Portal>
          <MenuList
            width="100vw"
            height={finalHeight}
            background={tocBgColor}
            borderRadius="none"
            borderColor={tocBgColor}
            zIndex="popover"
            px={7}
            mt="-2px" // Move the popover slightly higher to hide Header border
            overflow="auto"
          >
            {manifest.toc.map((content: ReadiumLink) => (
              <React.Fragment key={content.title}>
                <TocItem
                  href={getLinkHref(content)}
                  title={content.title}
                  isActive={readerState?.currentTocUrl === content.href}
                  onClick={tocLinkHandler}
                />
                {content.children &&
                  content.children.map((subLink) => (
                    <TocItem
                      key={subLink.title}
                      href={getLinkHref(subLink)}
                      title={subLink.title}
                      isActive={readerState?.currentTocUrl === subLink.href}
                      onClick={tocLinkHandler}
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

type TocItemProps = React.ComponentPropsWithoutRef<typeof MenuItem> & {
  href: string;
  title: string | undefined;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

const TocItem = (props: TocItemProps) => {
  const { href, title, isActive, ...rest } = props;

  const bgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const color = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const borderColor = useColorModeValue(
    'ui.gray.medium',
    'gray.500',
    'yellow.600'
  );

  const activeColor = 'ui.black';
  const activeBgColor = 'ui.gray.light-cool';

  const _hover = {
    textDecoration: 'none',
    background: isActive ? 'ui.black' : 'ui.gray.x-dark',
    color: 'ui.white',
  };

  const _focus = {
    ..._hover,
    boxShadow: 'none',
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
    <MenuItem as={Link} href={href} {...styles} {...rest}>
      <RenderHtml title={title ?? ''} />
    </MenuItem>
  );
};

const RenderHtml = ({ title }: { title: string }) => (
  <span dangerouslySetInnerHTML={{ __html: title }}></span>
);
