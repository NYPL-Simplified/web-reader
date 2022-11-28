import * as React from 'react';
import { ButtonGroup, Heading, Stack, Text } from '@chakra-ui/react';
import { HtmlNavigator, ReaderState } from '../types';
import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import {
  Continuous,
  Day,
  EnlargeFont,
  Night,
  Paginated,
  ReduceFont,
  Reset,
  Sepia,
} from './icons';

export type HtmlSettingsProps = {
  buttonTextColor: string;
  checkedButtonBgColor: string;
  navigator: HtmlNavigator;
  iconFill: string;
  readerState: ReaderState;
  paginationValue: string;
};

const fontInfo = {
  publisher: {
    heading: "Publisher's default font",
    body:
      "Show the publisher's-specified fonts and layout choices in this ebook",
    token: 'roboto',
    fontWeight: 'light',
  },
  serif: {
    heading: 'Serif font',
    body: 'Georgia',
    token: 'georgia',
    fontWeight: 'regular',
  },
  'sans-serif': {
    heading: 'Sans-serif font',
    body: 'Hevetica',
    token: 'helvetica',
    fontWeight: 'regular',
  },
  'open-dyslexic': {
    heading: 'Dyslexic friendly font',
    body: 'OpenDyslexic',
    token: 'opendyslexic',
    fontWeight: 'regular',
  },
};

export default function HtmlSettings(
  props: HtmlSettingsProps
): React.ReactElement | null {
  const {
    buttonTextColor,
    checkedButtonBgColor,
    navigator,
    iconFill,
    readerState,
    paginationValue,
  } = props;
  if (!readerState.settings) return null;
  const { colorMode, fontFamily, fontSize, isScrolling } = readerState.settings;

  const {
    setFontFamily,
    decreaseFontSize,
    increaseFontSize,
    resetFontSize,
    setColorMode,
    setScroll,
  } = navigator;

  const settingsHaveChanged =
    colorMode !== 'day' ||
    fontSize !== 100 ||
    fontFamily !== 'publisher' ||
    isScrolling;

  const resetSettings = () => {
    setColorMode('day');
    setFontFamily('publisher');
    setScroll('paginated');
    resetFontSize();
  };

  return (
    <>
      <ToggleGroup
        value={fontFamily}
        label="text font options"
        onChange={setFontFamily}
      >
        <ToggleButton value="publisher" label="Default" fontSize={[-1, -1, 0]}>
          <Text>Default</Text>
        </ToggleButton>
        <ToggleButton
          value="serif"
          label="Serif"
          font="georgia"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        >
          <Text>Serif</Text>
        </ToggleButton>
        <ToggleButton
          value="sans-serif"
          label="Sans-Serif"
          font="helvetica"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        >
          <Text>Sans-Serif</Text>
        </ToggleButton>
        <ToggleButton
          value="open-dyslexic"
          label="Dyslexia"
          font="opendyslexic"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        >
          <Text>Dyslexia</Text>
        </ToggleButton>
      </ToggleGroup>
      <Stack bgColor={checkedButtonBgColor} px={7} py={5}>
        <Heading
          as="h3"
          color={buttonTextColor}
          pb="10px"
          fontSize={2}
          fontWeight="light"
        >
          {fontInfo[fontFamily].heading}
        </Heading>
        <Text
          color={buttonTextColor}
          fontFamily={fontInfo[fontFamily].token}
          fontSize={-1}
          fontWeight={fontInfo[fontFamily].fontWeight}
        >
          {fontInfo[fontFamily].body}
        </Text>
      </Stack>
      <ToggleGroup
        value={colorMode}
        label="reading theme options"
        onChange={setColorMode}
      >
        <ToggleButton
          colorMode="day"
          icon={Day}
          value="day"
          label="Day"
          bgColor="ui.white"
          textColor="ui.black"
        >
          <Text>Day</Text>
        </ToggleButton>
        <ToggleButton
          colorMode="sepia"
          icon={Sepia}
          value="sepia"
          label="Sepia"
          bgColor="ui.sepia"
          textColor="ui.black"
        >
          <Text>Sepia</Text>
        </ToggleButton>
        <ToggleButton
          colorMode="night"
          icon={Night}
          value="night"
          label="Night"
          bgColor="ui.black"
          textColor="ui.white"
        >
          <Text>Night</Text>
        </ToggleButton>
      </ToggleGroup>
      <ButtonGroup d="flex" spacing={0}>
        <Button
          flexGrow={1}
          aria-label="Decrease font size"
          onClick={resetSettings}
          variant="settings"
        >
          <Reset
            w={12}
            h={12}
            fill={settingsHaveChanged ? iconFill : '#979797'}
          />
        </Button>
        <Button
          flexGrow={1}
          aria-label="Decrease font size"
          onClick={decreaseFontSize}
          variant="settings"
        >
          <ReduceFont w={12} h={12} fill={iconFill} />
        </Button>
        <Button
          flexGrow={1}
          aria-label="Increase font size"
          onClick={increaseFontSize}
          variant="settings"
        >
          <EnlargeFont w={12} h={12} fill={iconFill} />
        </Button>
      </ButtonGroup>
      <ToggleGroup
        onChange={setScroll}
        value={paginationValue}
        label="pagination options"
      >
        <ToggleButton
          value="paginated"
          label="Paginated"
          icon={Paginated}
          iconFill={iconFill}
        >
          <Text>Paginated</Text>
        </ToggleButton>
        <ToggleButton
          value="scrolling"
          label="Scrolling"
          icon={Continuous}
          iconFill={iconFill}
        >
          <Text>Scrolling</Text>
        </ToggleButton>
      </ToggleGroup>
    </>
  );
}
