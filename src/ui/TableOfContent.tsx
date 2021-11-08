import React from 'react';
import {
  Link,
  Portal,
  Text,
  Icon,
  useDisclosure,
  ListItem,
  UnorderedList,
  Box,
  SlideFade,
} from '@chakra-ui/react';
import { MdOutlineToc, MdOutlineCancel } from 'react-icons/md';
import { Navigator, WebpubManifest } from '../types';
import Button from './Button';
import useColorModeValue from './hooks/useColorModeValue';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';

export default function TableOfContent({
  navigator,
  manifest,
  containerRef,
}: {
  navigator: Navigator;
  manifest: WebpubManifest;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}): React.ReactElement {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });
  const focusRef = React.useRef<HTMLLIElement | null>(null);

  const tocLinkHandler = (href: string) => {
    navigator.goToPage(href);
    onClose();
  };

  const tocBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');

  const getLinkHref = (link: ReadiumLink): string => {
    if (link.href) return link.href;
    if (!link.children) throw new Error('Manifest is not well formed');
    return getLinkHref(link.children[0]);
  };

  /**
   * Open TOC and focus the right value
   */
  const openToc = () => {
    onOpen();
    console.log(focusRef.current);
    focusRef.current?.focus();
  };
  const closeToc = () => {
    onClose();
  };
  const toggleToc = () => {
    if (isOpen) {
      closeToc();
    } else {
      openToc();
    }
  };

  return (
    <>
      <Button
        border="none"
        onClick={toggleToc}
        leftIcon={
          <Icon as={isOpen ? MdOutlineCancel : MdOutlineToc} w={6} h={6} />
        }
      >
        <Text variant="headerNav">Table of Contents</Text>
      </Button>
      <Portal containerRef={containerRef}>
        <SlideFade in={isOpen} offsetY="20px">
          <Box
            position="absolute"
            top="0"
            left="0"
            bg={tocBgColor}
            right="0"
            bottom="0"
            width="100%"
            height="100%"
            zIndex="overlay"
          >
            <UnorderedList overflow="scroll" height="100%" m="0">
              {manifest.toc?.map((content: ReadiumLink) => (
                <Item
                  key={content.title}
                  aria-label={content.title}
                  onClick={() => tocLinkHandler(getLinkHref(content))}
                  html={content.title ?? ''}
                  ref={focusRef}
                >
                  {content.children && (
                    <UnorderedList>
                      {content.children.map((subLink) => (
                        <Item
                          aria-label={subLink.title}
                          key={subLink.title}
                          onClick={() => tocLinkHandler(getLinkHref(subLink))}
                          pl={10}
                          html={subLink.title ?? ''}
                        ></Item>
                      ))}
                    </UnorderedList>
                  )}
                </Item>
              ))}
            </UnorderedList>
          </Box>
        </SlideFade>
      </Portal>
    </>
  );
}

const Item = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<typeof ListItem> & { html: string }
>(({ html, children, ...props }, ref) => {
  const bgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const color = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const borderColor = useColorModeValue(
    'ui.gray.medium',
    'gray.500',
    'yellow.600'
  );

  const _hover = {
    textDecoration: 'none',
    background: 'ui.gray.x-dark',
    color: 'ui.white',
  } as const;

  const _focus = {
    ..._hover,
    boxShadow: 'none',
  } as const;

  return (
    <ListItem
      ref={ref}
      d="flex"
      flexDir="column"
      alignItems="stretch"
      listStyleType="none"
      bg={bgColor}
      color={color}
      {...props}
    >
      <Box
        borderBottom="1px solid"
        borderColor={borderColor}
        flex="1 0 auto"
        p={3}
        as={Link}
        d="block"
        _hover={_hover}
        _focus={_focus}
        dangerouslySetInnerHTML={{ __html: html }}
      ></Box>
      {children}
    </ListItem>
  );
});
