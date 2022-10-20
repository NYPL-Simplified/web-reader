import React from 'react';
import WebReader from '../src';
import { GetContent } from '../src/types';
// import createDecryptor from './axisnow/createWorkerlessDecryptor';
import createDecryptor from './axisnow/createWorkerDecryptor';
import { Heading, Box, Text } from '@chakra-ui/react';
import { Injectable } from '../src/Readium/Injectable';

type AxisNowEncryptedProps = {
  injectablesReflowable: Injectable[];
};

const webpubManifestUrl = `${origin}/samples/dickens-axisnow/encrypted/manifest.json`;
/**
 * This sample shows setting up a decryptor for this specific book and then passing a
 * getContent function to the Web Reader. This getContent function runs in a separate
 * WebWorker thread to decrypt the HTML and any embedded resources within.
 */
const AxisNowEncrypted: React.FC<AxisNowEncryptedProps> = (props) => {
  const [getContent, setGetContent] = React.useState<null | GetContent>(null);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const book_vault_uuid = process.env.AXISNOW_VAULT_UUID;
  const isbn = process.env.AXISNOW_ISBN;

  React.useEffect(() => {
    if (!book_vault_uuid || !isbn) {
      setError(
        new Error(
          'Book cannot be decrypted without process.env.AXISNOW_VAULT_UUID and process.env.AXISNOW_ISBN'
        )
      );
      return;
    }

    const params = {
      book_vault_uuid,
      isbn,
    };

    async function setup() {
      try {
        const res = await fetch(webpubManifestUrl);
        const manifest = await res.json();
        const decryptor = await createDecryptor({
          ...params,
          webpubManifest: manifest,
          webpubManifestUrl,
        });
        setGetContent(() => decryptor);
      } catch (e) {
        setError(e as any);
      }
    }

    setup();
  }, [book_vault_uuid, isbn]);

  if (error) {
    return (
      <Box m={3} role="alert">
        <Heading as="h1" fontSize="lg">
          Something went wrong:
        </Heading>
        <Text>
          {error.name}: {error.message}
        </Text>
      </Box>
    );
  }

  if (!getContent) return <div>loading...</div>;

  return (
    <WebReader
      injectablesReflowable={props.injectablesReflowable}
      webpubManifestUrl={webpubManifestUrl}
      getContent={getContent}
    />
  );
};

export default AxisNowEncrypted;
