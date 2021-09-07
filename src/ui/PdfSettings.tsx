import * as React from 'react';
import { ButtonGroup, Circle } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { PdfNavigator, PdfReaderState } from '../types';
import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';

type PdfSettingsProps = {
  navigator: PdfNavigator;
  readerState: PdfReaderState;
  paginationValue: string;
};

export default function PdfSettings(
  props: PdfSettingsProps
): React.ReactElement {
  const { navigator, readerState, paginationValue } = props;
  const { fontFamily } = readerState;
  const {
    setFontFamily,
    decreaseFontSize,
    increaseFontSize,
    setScroll,
  } = navigator;

  return (
    <>
      <ToggleGroup
        value={fontFamily}
        label="text font options"
        onChange={setFontFamily}
      >
        <ToggleButton value="publisher">Publisher</ToggleButton>
        <ToggleButton value="serif">Serif</ToggleButton>
        <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
        <ToggleButton value="open-dyslexic">Dyslexia-Friendly</ToggleButton>
      </ToggleGroup>
      <ButtonGroup d="flex" spacing={0}>
        <Button
          flexGrow={1}
          aria-label="Zoom In"
          onClick={decreaseFontSize}
          variant="toggle"
        >
          Zoom
          <Circle
            border="1px solid"
            p={1}
            ml={1}
            size="17px"
            alignItems="baseline"
          >
            <Icon decorative name={IconNames.minus} modifiers={['small']} />{' '}
          </Circle>
        </Button>
        <Button
          flexGrow={1}
          aria-label="Zoom Out"
          onClick={increaseFontSize}
          variant="toggle"
        >
          Zoom
          <Circle
            border="1px solid"
            p={1}
            ml={1}
            size="17px"
            alignItems="baseline"
          >
            <Icon decorative name={IconNames.plus} modifiers={['small']} />{' '}
          </Circle>
        </Button>
      </ButtonGroup>
      <ToggleGroup
        onChange={setScroll}
        value={paginationValue}
        label="pagination options"
      >
        <ToggleButton value="paginated">Paginated</ToggleButton>
        <ToggleButton value="scrolling">Scrolling</ToggleButton>
      </ToggleGroup>
    </>
  );
}
