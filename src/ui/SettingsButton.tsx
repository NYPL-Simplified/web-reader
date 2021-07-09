import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import { Navigator, ReaderState } from '../types';

export default function SettingsCard({
  navigator,
  state,
}: {
  navigator: Navigator;
  state: ReaderState;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const paginationValue = state?.isScrolling ? 'scrolling' : 'paginated';

  return (
    <>
      <Popover
        placement="bottom-end"
        closeOnBlur={false}
        isOpen={isOpen}
        onClose={close}
        autoFocus={false}
      >
        <PopoverTrigger>
          <Button onClick={open}>Settings</Button>
        </PopoverTrigger>
        <PopoverContent
          borderColor="gray.100"
          width="fit-content"
          _active={{ boxShadow: 'none' }}
        >
          <PopoverBody p={0}>
            <ToggleGroup value="publisher" label="text font options">
              <ToggleButton value="publisher">Publisher</ToggleButton>
              <ToggleButton value="serif">Serif</ToggleButton>
              <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
              <ToggleButton value="dyslexia-friendly">
                Dyslexia-Friendly
              </ToggleButton>
            </ToggleGroup>
            <ToggleGroup
              value={state?.colorMode}
              label="reading theme options"
              onChange={navigator?.setColorMode}
            >
              <ToggleButton colorScheme="light" value="day" variant="solid">
                Day
              </ToggleButton>
              <ToggleButton colorScheme="sepia" value="sepia" variant="solid">
                Sepia
              </ToggleButton>
              <ToggleButton colorScheme="dark" value="night" variant="solid">
                Night
              </ToggleButton>
            </ToggleGroup>
            <ToggleGroup
              onChange={navigator?.setScroll}
              value={paginationValue}
              label="pagination options"
            >
              <ToggleButton value="paginated">Paginated</ToggleButton>
              <ToggleButton value="scrolling">Scrolling</ToggleButton>
            </ToggleGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
