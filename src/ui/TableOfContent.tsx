import React, { useState } from 'react';
import { Text } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { Navigator, WebpubManifest } from '../types';
import { Link } from '@chakra-ui/react';
import Button from './Button';

export default function TableOfContent({
  navigator,
  manifest,
}: {
  navigator: Navigator;
  manifest: WebpubManifest;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tocLinkHandler = (evt: any) => {
    evt.preventDefault();
    navigator.goToPage(evt.target.getAttribute('href'));
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button border="none" onClick={() => setIsOpen(!isOpen)}>
        <Icon decorative name={IconNames.download} modifiers={['small']} />
        <Text variant="headerNav">Table of Contents</Text>
      </Button>
      {isOpen && manifest?.toc && (
        <ul
          style={{
            position: 'fixed',
            top: '50px',
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'lightgray',
            padding: '1rem 3rem',
            margin: 0,
            overflow: 'auto',
            zIndex: 999999,
          }}
        >
          {manifest.toc.map((content) => (
            <li key={content.title}>
              <Link
                href={content.href}
                onClick={tocLinkHandler}
                fontSize="2"
                _hover={{ fontSize: '3' }}
              >
                {content.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
