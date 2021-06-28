import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
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
      >
        <PopoverTrigger>
          <Button onClick={open}>Settings</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader fontWeight="semibold" variant="setting">
            Settings
          </PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <ToggleGroup defaultValue="publisher">
              <ToggleButton value="publisher" variant="setting">
                Publisher
              </ToggleButton>
              <ToggleButton value="serif" variant="setting">
                Serif
              </ToggleButton>
              <ToggleButton value="sans-serif" variant="setting">
                Sans-Serif
              </ToggleButton>
              <ToggleButton value="dyslexia-friendly" variant="setting">
                Dyslexia-Friendly
              </ToggleButton>
            </ToggleGroup>
            <ToggleGroup defaultValue="day">
              <ToggleButton colorScheme="light" value="day">
                Day
              </ToggleButton>
              <ToggleButton colorScheme="sepia" value="sepia">
                Sepia
              </ToggleButton>
              <ToggleButton colorScheme="dark" value="night">
                Night
              </ToggleButton>
            </ToggleGroup>
            <ToggleGroup
              onChange={setScroll}
              value={paginationValue}
              defaultValue="paginated"
            >
              <ToggleButton value="paginated" variant="setting">
                Paginated
              </ToggleButton>
              <ToggleButton value="scrolling" variant="setting">
                Scrolling
              </ToggleButton>
            </ToggleGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
