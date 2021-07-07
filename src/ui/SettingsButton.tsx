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
import Navigator from '../Navigator';

export default function SettingsCard({ navigator }: { navigator: Navigator }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  function setScroll(val: string) {
    switch (val) {
      case 'scrolling':
        navigator.scroll();
        break;
      case 'paginated':
        navigator.paginate();
        break;
      default:
        throw new Error(`Scroll value ${val} not accepted.`);
    }
  }

  const paginationValue = navigator.isScrolling ? 'scrolling' : 'paginated';

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
            <ToggleGroup value="day" label="reading theme options">
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
              onChange={setScroll}
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
