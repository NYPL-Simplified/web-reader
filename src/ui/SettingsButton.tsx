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
import { VisualNavigator } from '../Navigator';

export default function SettingsCard({
  navigator,
}: {
  navigator: VisualNavigator;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
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

  const paginationValue = navigator.isScroll ? 'scrolling' : 'paginated';

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
          <PopoverHeader fontWeight="semibold">Settings</PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <ToggleGroup defaultValue="publisher">
              <ToggleButton value="publisher">Publisher</ToggleButton>
              <ToggleButton value="serif">Serif</ToggleButton>
              <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
              <ToggleButton value="dyslexia-friendly">
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
            <ToggleGroup onChange={setScroll} value={paginationValue}>
              <ToggleButton value="paginated">Paginated</ToggleButton>
              <ToggleButton value="scrolling">Scrolling</ToggleButton>
            </ToggleGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
