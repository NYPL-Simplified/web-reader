import React from 'react';
import { Meta } from '@storybook/react';
import { Box, Text, HStack, useTheme, VStack } from '@chakra-ui/react';

const meta: Meta = {
  title: 'Theme',
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const ColorCard = ({ color }: { color: SingleColor }) => {
  return (
    <VStack
      spacing={0}
      w="100px"
      h="100px"
      flex="0 0 100px"
      display="flex"
      my={2}
      border="1px solid black"
      borderRadius="sm"
    >
      <Box flex="1 0 auto" w="100%" bg={color.value} />
      <Text fontSize="xs" p={1} mt={0}>
        {color.title}
      </Text>
    </VStack>
  );
};

type SingleColor = { title: string; value: string };
type MultiColor = { title: string; children: SingleColor[] };

const ColorRow = ({ color }: { color: SingleColor | MultiColor }) => {
  if ('value' in color) {
    return <ColorCard color={color} />;
  }
  return (
    <HStack direction="column">
      {color.children.map((color) => (
        <ColorCard color={color} key={color.title} />
      ))}
    </HStack>
  );
};

export const Colors = () => {
  const theme = useTheme();

  const themeColors: Record<string, string | Record<string, string>> =
    theme.colors;

  // colors provided by chakra we just want to ignore
  const ignored = [
    'facebook',
    'twitter',
    'telegram',
    'whatsapp',
    'linkedin',
    'messenger',
    'transparent',
    'current',
    'black',
    'white',
    'whiteAlpha',
  ];

  const keys = Object.keys(themeColors).filter((key) => !ignored.includes(key));

  const colors = keys.map((key) => {
    const value = themeColors[key];
    if (typeof value === 'string') {
      return { title: key, value };
    }
    return {
      title: key,
      children: Object.keys(value).map((subkey: string) => {
        return { title: `${key}.${subkey}`, value: value[subkey] };
      }),
    };
  });

  return (
    <>
      {colors.map((color) => (
        <ColorRow color={color} key={color.title} />
      ))}
    </>
  );
};
