import * as React from 'react';
import { ButtonGroup, Icon } from '@chakra-ui/react';
import { PdfNavigator, PdfReaderState } from '../types';
import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import { MdOutlineZoomIn, MdOutlineZoomOut } from 'react-icons/md';

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
          <Icon as={MdOutlineZoomOut} w={7} h={7} pl={1} />
        </Button>
        <Button
          flexGrow={1}
          aria-label="Zoom In"
          onClick={zoomIn}
          variant="toggle"
        >
          Zoom In
          <Icon as={MdOutlineZoomIn} w={7} h={7} pl={1} />
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
