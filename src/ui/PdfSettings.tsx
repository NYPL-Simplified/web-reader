import * as React from 'react';
import { ButtonGroup, Circle } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';
import { PdfNavigator, PdfReaderState } from '../types';
import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';

export type PdfSettingsProps = {
  navigator: PdfNavigator;
  readerState: PdfReaderState;
  paginationValue: string;
};

export default function PdfSettings(
  props: PdfSettingsProps
): React.ReactElement {
  const { navigator, paginationValue } = props;
  const { zoomOut, zoomIn, setScroll } = navigator;

  return (
    <>
      <ButtonGroup d="flex" spacing={0}>
        <Button
          flexGrow={1}
          aria-label="Zoom Out"
          onClick={zoomOut}
          variant="toggle"
        >
          Zoom Out
          <Circle
            border="1px solid"
            p={1}
            ml={1}
            size="17px"
            alignItems="baseline"
          >
            <Icon decorative name={IconNames.minus} modifiers={['small']} />
          </Circle>
        </Button>
        <Button
          flexGrow={1}
          aria-label="Zoom In"
          onClick={zoomIn}
          variant="toggle"
        >
          Zoom In
          <Circle
            border="1px solid"
            p={1}
            ml={1}
            size="17px"
            alignItems="baseline"
          >
            <Icon decorative name={IconNames.plus} modifiers={['small']} />
          </Circle>
        </Button>
      </ButtonGroup>
      <ToggleGroup
        onChange={setScroll}
        value={paginationValue}
        label="pagination options"
      >
        <ToggleButton value="paginated" label="Paginated">
          Paginated
        </ToggleButton>
        <ToggleButton value="scrolling" label="Scrolling">
          Scrolling
        </ToggleButton>
      </ToggleGroup>
    </>
  );
}
