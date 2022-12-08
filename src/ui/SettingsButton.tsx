import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Icon,
} from '@chakra-ui/react';
import { PDFActiveReader, HTMLActiveReader } from '../types';

import Button from './Button';
import useColorModeValue from './hooks/useColorModeValue';
import PdfSettings from './PdfSettings';
import HtmlSettings from './HtmlSettings';
import { ReaderSettings } from './icons';

type SettingsCardProps =
  | Pick<PDFActiveReader, 'navigator' | 'state' | 'type'>
  | Pick<HTMLActiveReader, 'navigator' | 'state' | 'type'>;

export default function SettingsCard(
  props: SettingsCardProps
): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const buttonTextColor = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const checkedButtonBgColor = useColorModeValue(
    'ui.gray.light-warm',
    'ui.gray.x-dark',
    'ui.sepiaChecked'
  );
  const contentBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.white');
  const iconFill = useColorModeValue(
    'ui.gray.icon',
    'ui.white',
    'ui.gray.icon'
  );
  const paginationValue = props.state?.settings?.isScrolling
    ? 'scrolling'
    : 'paginated';

  return (
    <>
      <Popover
        gutter={0}
        placement="bottom-end"
        isOpen={isOpen}
        onOpen={open}
        onClose={close}
        offset={[-200, 0]}
        autoFocus={true}
      >
        <PopoverTrigger>
          <Button
            onClick={open}
            border="none"
            aria-label="Settings"
            leftIcon={<Icon as={ReaderSettings} w={6} h={6} fill={iconFill} />}
          >
            <Text variant="headerNav">Settings</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          bgColor={contentBgColor}
          borderRadius="0 0 4px 4px"
          boxShadow="0 4px 4px -2px #424242"
          minWidth="fit-content"
        >
          <PopoverBody p={0} maxWidth="100vw">
            {props.type === 'PDF' && (
              <PdfSettings
                // Destructuring props before type check causes Typescript warning.
                navigator={props.navigator}
                readerState={props.state}
                paginationValue={paginationValue}
              />
            )}
            {props.type === 'HTML' && (
              <HtmlSettings
                buttonTextColor={buttonTextColor}
                checkedButtonBgColor={checkedButtonBgColor}
                navigator={props.navigator}
                iconFill={iconFill}
                readerState={props.state}
                paginationValue={paginationValue}
              />
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
