import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { Navigator, ReaderState } from '../types';
import { Icon, IconNames } from '@nypl/design-system-react-components';

import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';
import useColorModeValue from './hooks/useColorModeValue';

export default function SettingsCard({
  navigator,
  readerState,
}: {
  navigator: Navigator;
  readerState: ReaderState;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const paginationValue = readerState?.isScrolling ? 'scrolling' : 'paginated';
  const contentBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.white');

  return (
    <>
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onClose={close}
        autoFocus={true}
      >
        <PopoverTrigger>
          <Button onClick={open} border="none">
            <Icon decorative name={IconNames.plus} modifiers={['small']} />{' '}
            <Text variant="headerNav">Settings</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          borderColor="gray.100"
          width="fit-content"
          bgColor={contentBgColor}
        >
          <PopoverBody p={0} maxWidth="95vw">
            <ToggleGroup
              value={readerState.fontFamily}
              label="text font options"
              onChange={navigator.setFontFamily}
            >
              <ToggleButton value="publisher">Publisher</ToggleButton>
              <ToggleButton value="serif">Serif</ToggleButton>
              <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
              <ToggleButton value="open-dyslexic">
                Dyslexia-Friendly
              </ToggleButton>
            </ToggleGroup>
            <ButtonGroup d="flex" spacing={0}>
              <Button
                flexGrow={1}
                aria-label="Decrease font size"
                onClick={navigator.decreaseFontSize}
                variant="toggle"
              >
                A-
              </Button>
              <Button
                flexGrow={1}
                aria-label="Increase font size"
                onClick={navigator.increaseFontSize}
                variant="toggle"
              >
                A+
              </Button>
            </ButtonGroup>
            <ToggleGroup
              value={readerState.colorMode}
              label="reading theme options"
              onChange={navigator.setColorMode}
            >
              <ToggleButton
                colorMode="day"
                value="day"
                _checked={{ bg: 'ui.white' }} // default _checked color is green for toggles
              >
                Day
              </ToggleButton>
              <ToggleButton
                colorMode="sepia"
                value="sepia"
                bg="ui.sepia" // distinct case where default needs to be sepia
                _active={{ bg: 'ui.sepia' }}
                _hover={{ bg: 'ui.sepia' }}
                _checked={{ bg: 'ui.sepia' }}
              >
                Sepia
              </ToggleButton>
              <ToggleButton
                colorMode="night"
                value="night"
                _checked={{ bg: 'ui.black' }}
              >
                Night
              </ToggleButton>
            </ToggleGroup>
            <ToggleGroup
              onChange={navigator.setScroll}
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
