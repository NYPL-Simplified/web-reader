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
import {
  HtmlNavigator,
  PdfNavigator,
  PDFTreeNode,
  ReaderState,
  WebpubManifest,
} from '../types';
import Button from './Button';
import useColorModeValue from './hooks/useColorModeValue';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import { HEADER_HEIGHT } from './constants';
import { PdfState } from '../PdfReader';

type TocItemProps = React.ComponentPropsWithoutRef<typeof MenuItem> & {
  href: string;
  title: string | undefined;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

const TocItem = (props: TocItemProps) => {
  const { href, title, isActive, onItemClick, ...rest } = props;

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

export default function TableOfContent({
  navigator,
  manifest,
  readerState,
}: {
  navigator: PdfNavigator | HtmlNavigator;
  manifest: WebpubManifest;
  readerState: ReaderState | PdfState;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [outline, setOutline] = useState<JSX.Element[]>([]);

  const tocLinkHandler = (
    evt: React.MouseEvent<Element, MouseEvent>,
    item?: PDFTreeNode
  ) => {
    evt.preventDefault();
    const href: string | null = evt.currentTarget.getAttribute('href');
    if (href && href !== '#') {
      navigator.goToPage(href);
      setIsOpen(false);
    } else if (item && item.dest) {
      console.log('item', item);
      navigator.goToPage(item.dest);
      setIsOpen(false);
    }
  };

  const pdfResource = (readerState as PdfState).pdf;

  const pdfToc =
    pdfResource &&
    manifest &&
    manifest.resources &&
    manifest.resources.length === 1;

  if (pdfToc) {
    const getPdfOutline = (outline: PDFTreeNode[] | undefined) => {
      if (!outline)
        throw new Error(
          'Cannot call getPdfOutline when there is no PDF Reader'
        );
      return outline.map((content: PDFTreeNode) => (
        <React.Fragment key={content.title}>
          <TocItem
            href="#"
            title={content.title}
            isActive={false}
            onClick={(e) => {
              tocLinkHandler(e, content);
            }}
          />
          {content.items &&
            content.items.map((subLink: PDFTreeNode) => (
              <TocItem
                key={subLink.title}
                href="#"
                title={subLink.title}
                isActive={false}
                onClick={(e) => tocLinkHandler(e, subLink)}
                pl={10}
              />
            ))}
        </React.Fragment>
      ));
    };

    const getOutline = async () => {
      if (pdfResource) {
        const outline: PDFTreeNode[] = await pdfResource.getOutline();
        const pdfOutline = getPdfOutline(outline);
        setOutline(pdfOutline);
      } else {
        throw new Error('trying to get state');
      }
    };

    if (outline.length === 0) {
      getOutline();
    }
  }

  const tocBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');

  const getLinkHref = (link: ReadiumLink): string => {
    if (link.href) return link.href;
    if (!link.children) throw new Error('Manifest is not well formed');
    return getLinkHref(link.children[0]);
  };

  return (
    <Menu
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)} // To account for "close by lose focus"
    >
      <MenuButton as={Button} border="none">
        <Icon as={isOpen ? MdOutlineCancel : MdOutlineToc} w={6} h={6} />
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
            {pdfToc && outline}
            {!pdfToc &&
              manifest.toc.map((content: ReadiumLink) => (
                <React.Fragment key={content.title}>
                  <TocItem
                    href={getLinkHref(content)}
                    title={content.title}
                    isActive={readerState?.currentTocLocation === content.href}
                    onClick={tocLinkHandler}
                  />
                  {content.children &&
                    content.children.map((subLink) => (
                      <TocItem
                        key={subLink.title}
                        href={getLinkHref(subLink)}
                        title={subLink.title}
                        isActive={
                          readerState?.currentTocLocation === subLink.href
                        }
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

const RenderHtml = ({ title }: { title: string }) => (
  <span dangerouslySetInnerHTML={{ __html: title }}></span>
);
