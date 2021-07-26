import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  ButtonGroup,
  Button as ChakraButton,
  Text,
} from '@chakra-ui/react';
import Button from './Button';
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
  const [font, setFont] = React.useState('publisher');
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const paginationValue = state?.isScrolling ? 'scrolling' : 'paginated';

  return (
    <>
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onClose={close}
        autoFocus={true}
      >
        <PopoverTrigger>
          <ChakraButton onClick={open} variant="headerNav">
            <Icon decorative name={IconNames.plus} modifiers={['small']} />{' '}
            <Text variant="headerNav">Settings</Text>
          </ChakraButton>
        </PopoverTrigger>
        <PopoverContent borderColor="gray.100" width="fit-content">
          <PopoverBody p={0} maxWidth="95vw">
            <ToggleGroup
              value={font}
              label="text font options"
              onChange={(val) => setFont(val)}
            >
              <ToggleButton value="publisher">Publisher</ToggleButton>
              <ToggleButton value="serif">Serif</ToggleButton>
              <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
              <ToggleButton value="dyslexia-friendly">
                Dyslexia-Friendly
              </ToggleButton>
            </ToggleGroup>
            <ButtonGroup d="flex" spacing={0}>
              <Button
                flexGrow="1"
                aria-label="Decrease font size"
                onClick={navigator.decreaseFontSize}
              >
                A-
              </Button>
              <Button
                flexGrow="1"
                aria-label="Increase font size"
                onClick={navigator.increaseFontSize}
              >
                A+
              </Button>
            </ButtonGroup>
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
