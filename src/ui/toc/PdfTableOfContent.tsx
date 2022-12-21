import React from 'react';
import { Portal, Text, Icon, useMultiStyleConfig } from '@chakra-ui/react';
import { MdOutlineToc, MdOutlineCancel } from 'react-icons/md';
import { Navigator, PdfTocItem } from '../../types';
import Button from '../Button';
import useColorModeValue from '../hooks/useColorModeValue';
import { Menu, MenuButton, MenuList } from '../menu';
import { Item } from './Item';
import { MissingToc } from './MissingToc';

export default function PdfTableOfContent({
  navigator,
  tocItems,
  containerRef,
}: {
  navigator: Navigator;
  tocItems: PdfTocItem[];
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}): React.ReactElement {
  const tocLinkHandler = (pageNumber: number) => {
    if (navigator.goToPageNumber) {
      navigator.goToPageNumber(pageNumber);
    }
  };
  const tocBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const styles = useMultiStyleConfig('TableOfContent', {});

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
              {tocItems && tocItems.length > 0 ? (
                tocItems.map((item: PdfTocItem, i) => (
                  <Item
                    key={item.title}
                    aria-label={item.title}
                    onClick={() => tocLinkHandler(item.pageNumber)}
                    html={item.title ?? ''}
                  >
                    {item.children && (
                      <>
                        {item.children.map((subLink) => (
                          <Item
                            aria-label={subLink.title}
                            key={subLink.title}
                            onClick={() => tocLinkHandler(subLink.pageNumber)}
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
