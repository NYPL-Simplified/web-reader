import * as React from 'react';
import { ButtonGroup, Heading, Stack, Text } from '@chakra-ui/react';
import { HtmlNavigator, ReaderState } from '../types';
import Button from './Button';
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
import { FONT_DETAILS } from '../constants';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';

export type HtmlSettingsProps = {
  buttonTextColor: string;
  checkedButtonBgColor: string;
  navigator: HtmlNavigator;
  iconFill: string;
  readerState: ReaderState;
  paginationValue: string;
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
    resetSettings,
    setColorMode,
    setScroll,
  } = navigator;

  const settingsHaveChanged =
    colorMode !== 'day' ||
    fontSize !== 100 ||
    fontFamily !== 'publisher' ||
    isScrolling;

  return (
    <>
      <ToggleGroup
        value={fontFamily}
        label="text font options"
        onChange={setFontFamily}
      >
        <ToggleButton
          value="publisher"
          label="Default"
          fontSize={[-1, -1, 0]}
        />
        <ToggleButton
          value="serif"
          label="Serif"
          font="georgia"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        />
        <ToggleButton
          value="sans-serif"
          label="Sans-Serif"
          font="helvetica"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        />
        <ToggleButton
          value="open-dyslexic"
          label="Dyslexia"
          font="opendyslexic"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        />
      </ToggleGroup>
      <Stack bgColor={checkedButtonBgColor} px={7} py={5}>
        <Heading
          as="h3"
          color={buttonTextColor}
          pb="10px"
          fontSize={2}
          fontWeight="light"
        >
          {FONT_DETAILS[fontFamily].heading}
        </Heading>
        <Text
          color={buttonTextColor}
          fontFamily={FONT_DETAILS[fontFamily].token}
          fontSize={-1}
          fontWeight={FONT_DETAILS[fontFamily].fontWeight}
        >
          {FONT_DETAILS[fontFamily].body}
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
        />
        <ToggleButton
          colorMode="sepia"
          icon={Sepia}
          value="sepia"
          label="Sepia"
          bgColor="ui.sepia"
          textColor="ui.black"
        />
        <ToggleButton
          colorMode="night"
          icon={Night}
          value="night"
          label="Night"
          bgColor="ui.black"
          textColor="ui.white"
        />
      </ToggleGroup>
      <ButtonGroup d="flex" spacing={0}>
        <Button
          flexGrow={1}
          aria-label="Reset settings"
          onClick={resetSettings}
          variant="settings"
        >
          <Reset
            w="45px"
            h="45px"
            fill={settingsHaveChanged ? iconFill : 'ui.gray.disabled'}
          />
        </Button>
        <Button
          flexGrow={1}
          aria-label="Decrease font size"
          onClick={decreaseFontSize}
          variant="settings"
        >
          <ReduceFont w="45px" h="45px" fill={iconFill} />
        </Button>
        <Button
          flexGrow={1}
          aria-label="Increase font size"
          onClick={increaseFontSize}
          variant="settings"
        >
          <EnlargeFont w="45px" h="45px" fill={iconFill} />
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
        />
        <ToggleButton
          value="scrolling"
          label="Scrolling"
          icon={Continuous}
          iconFill={iconFill}
        />
      </ToggleGroup>
    </>
  );
}
