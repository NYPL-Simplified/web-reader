import * as React from 'react';
import { ButtonGroup, Heading, Stack, Text } from '@chakra-ui/react';
import { HtmlNavigator, ReaderSettings, ReaderState } from '../types';
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
import { DEFAULT_SETTINGS, FONT_DETAILS } from '../constants';
import ToggleButton, {
  ColorModeToggleButton,
  FontToggleButton,
} from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import useColorModeValue from './hooks/useColorModeValue';

export type HtmlSettingsProps = {
  navigator: HtmlNavigator;
  iconFill: string;
  readerState: ReaderState;
  paginationValue: string;
};

export default function HtmlSettings(
  props: HtmlSettingsProps
): React.ReactElement | null {
  const { navigator, iconFill, readerState, paginationValue } = props;

  const buttonTextColor = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const checkedButtonBgColor = useColorModeValue(
    'ui.gray.light-warm',
    'ui.gray.x-dark',
    'ui.sepiaChecked'
  );

  if (!readerState.settings) return null;
  const { colorMode, fontFamily } = readerState.settings;

  const {
    setFontFamily,
    decreaseFontSize,
    increaseFontSize,
    resetSettings,
    setColorMode,
    setScroll,
  } = navigator;

  return (
    <>
      <ToggleGroup
        value={fontFamily}
        label="text font options"
        onChange={setFontFamily}
      >
        <FontToggleButton value="publisher" label="Default" />
        <FontToggleButton
          value="serif"
          label="Serif"
          fontFamily="serif"
          fontWeight="regular"
        />
        <FontToggleButton
          value="sans-serif"
          label="Sans-Serif"
          fontFamily="sansSerif"
          fontWeight="regular"
        />
        <FontToggleButton
          value="open-dyslexic"
          label="Dyslexia"
          fontFamily="opendyslexic"
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
        <ColorModeToggleButton
          colorMode="day"
          icon={Day}
          value="day"
          label="Day"
          bgColor="ui.white"
          textColor="ui.black"
        />
        <ColorModeToggleButton
          colorMode="sepia"
          icon={Sepia}
          value="sepia"
          label="Sepia"
          bgColor="ui.sepia"
          textColor="ui.black"
        />
        <ColorModeToggleButton
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
            fill={
              areSettingsDefault(readerState.settings)
                ? 'ui.gray.disabled'
                : iconFill
            }
          />
        </Button>
        <Button
          aria-label="Decrease font size"
          flexGrow={1}
          isFontSizeButton
          onClick={decreaseFontSize}
          sx={{
            _active: {
              bgColor: checkedButtonBgColor,
            },
          }}
          value="decrease font size"
          variant="settings"
        >
          <ReduceFont w="45px" h="45px" fill={iconFill} />
        </Button>
        <Button
          aria-label="Increase font size"
          flexGrow={1}
          isFontSizeButton
          onClick={increaseFontSize}
          sx={{
            _active: {
              bgColor: checkedButtonBgColor,
            },
          }}
          value="increase font size"
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

// Returns true if the reader's settings match the default settings
const areSettingsDefault = (readerSettings: ReaderSettings) => {
  if (!readerSettings) {
    return false;
  }

  let setting: keyof ReaderSettings;

  for (setting in DEFAULT_SETTINGS) {
    if (readerSettings[setting] !== DEFAULT_SETTINGS[setting]) {
      return false;
    }
  }
  return true;
};
