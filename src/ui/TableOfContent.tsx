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
  const { isOpen, onClose, onToggle } = useDisclosure({
    defaultIsOpen: false,
  });

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

  return (
    <>
      <Button
        border="none"
        onClick={onToggle}
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

const Item: React.FC<
  React.ComponentProps<typeof ListItem> & { html: string }
> = ({ html, children, ...props }) => {
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
};
