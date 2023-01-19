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
        placement="bottom-start"
        isOpen={isOpen}
        onOpen={open}
        onClose={close}
        autoFocus={true}
        preventOverflow
        strategy="fixed"
      >
        <PopoverTrigger>
          <Button
            aria-label="Settings"
            onClick={open}
            border="none"
            gap={[0, 0, 2]}
          >
            <Icon as={ReaderSettings} fill={iconFill} w={6} h={6} />
            <Text variant="headerNav">Settings</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          overflow="hidden"
          bgColor={contentBgColor}
          borderColor="ui.gray.disabled"
          borderRadius="0 0 2px 2px"
          filter="drop-shadow(0 1px 2px #00000040)"
          width={['90vw', '90vw', 'inherit']}
          maxWidth="100vw"
        >
          <PopoverBody p={0}>
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
