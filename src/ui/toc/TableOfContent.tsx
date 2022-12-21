import React from 'react';
import { Portal, Text, Icon, useMultiStyleConfig } from '@chakra-ui/react';
import { MdOutlineToc, MdOutlineCancel } from 'react-icons/md';
import { Navigator, WebpubManifest } from '../../types';
import Button from '../Button';
import useColorModeValue from '../hooks/useColorModeValue';
import { ReadiumLink } from '../../WebpubManifestTypes/ReadiumLink';
import { Menu, MenuButton, MenuList } from '../menu';
import { Item } from './Item';
import { MissingToc } from './MissingToc';

export default function TableOfContent({
  navigator,
  manifest,
  containerRef,
}: {
  navigator: Navigator;
  manifest: WebpubManifest;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}): React.ReactElement {
  const tocLinkHandler = (href: string) => {
    navigator.goToPage(href);
  };
  const tocBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const styles = useMultiStyleConfig('TableOfContent', {});

  const getLinkHref = (link: ReadiumLink): string => {
    if (link.href) return link.href;
    if (!link.children) throw new Error('Manifest is not well formed');
    return getLinkHref(link.children[0]);
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            border="none"
            aria-label="Table of Contents"
            leftIcon={
              <Icon
                as={isOpen ? MdOutlineCancel : MdOutlineToc}
                sx={styles.icon}
              />
            }
          >
            <Text variant="headerNav">Table of Contents</Text>
          </MenuButton>
          <Portal containerRef={containerRef}>
            <MenuList sx={styles.menuList} bg={tocBgColor}>
              {manifest.toc && manifest.toc.length > 0 ? (
                manifest.toc.map((content: ReadiumLink, i) => (
                  <Item
                    key={content.title}
                    aria-label={content.title}
                    onClick={() => tocLinkHandler(getLinkHref(content))}
                    html={content.title ?? ''}
                  >
                    {content.children && (
                      <>
                        {content.children.map((subLink) => (
                          <Item
                            aria-label={subLink.title}
                            key={subLink.title}
                            onClick={() => tocLinkHandler(getLinkHref(subLink))}
                            pl={10}
                            html={subLink.title ?? ''}
                          ></Item>
                        ))}
                      </>
                    )}
                  </Item>
                ))
              ) : (
                <MissingToc>
                  This publication does not have a Table of Contents.
                </MissingToc>
              )}
            </MenuList>
          </Portal>
        </>
      )}
    </Menu>
  );
}
