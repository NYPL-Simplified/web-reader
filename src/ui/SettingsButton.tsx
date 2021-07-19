import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Button as ChakraButton,
} from '@chakra-ui/react';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import { Navigator, ReaderState } from '../types';
import { Icon, IconNames } from '@nypl/design-system-react-components';

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
        placement="bottom"
        closeOnBlur={false}
        isOpen={isOpen}
        onClose={close}
        autoFocus={false}
      >
        <PopoverTrigger>
          <ChakraButton onClick={open} variant="headerNav">
            <Icon decorative name={IconNames.plus} modifiers={['small']} />{' '}
            <Text variant="headerNav">Settings</Text>
          </ChakraButton>
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
