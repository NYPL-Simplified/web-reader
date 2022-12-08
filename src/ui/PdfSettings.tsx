import * as React from 'react';
import { ButtonGroup, Icon, Text } from '@chakra-ui/react';
import { PdfNavigator, ReaderState } from '../types';
import Button from './Button';
import { Continuous, Paginated } from './icons';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import { MdOutlineZoomIn, MdOutlineZoomOut } from 'react-icons/md';

export type PdfSettingsProps = {
  navigator: PdfNavigator;
  readerState: ReaderState;
  paginationValue: string;
};

export default function PdfSettings(
  props: PdfSettingsProps
): React.ReactElement {
  const { navigator, paginationValue } = props;
  const { zoomOut, zoomIn, setScroll } = navigator;

  const iconFill = 'ui.gray.icon';

  return (
    <>
      <ButtonGroup d="flex" spacing={0}>
        <Button
          flexGrow={1}
          aria-label="Zoom Out"
          onClick={zoomOut}
          variant="settings"
        >
          <Icon as={MdOutlineZoomOut} w={7} h={7} pl={1} />
          Zoom Out
        </Button>
        <Button
          flexGrow={1}
          aria-label="Zoom In"
          onClick={zoomIn}
          variant="settings"
        >
          <Icon as={MdOutlineZoomIn} w={7} h={7} pl={1} />
          Zoom In
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
