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
import { MdOutlineSettings, MdOutlineCancel } from 'react-icons/md';

import Button from './Button';
import useColorModeValue from './hooks/useColorModeValue';
import PdfSettings from './PdfSettings';
import HtmlSettings from './HtmlSettings';

type SettingsCardProps =
  | Pick<PDFActiveReader, 'navigator' | 'state' | 'type'>
  | Pick<HTMLActiveReader, 'navigator' | 'state' | 'type'>;

export default function SettingsCard(
  props: SettingsCardProps
): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const paginationValue = props.state?.settings?.isScrolling
    ? 'scrolling'
    : 'paginated';
  const contentBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.white');

  return (
    <>
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onOpen={open}
        onClose={close}
        autoFocus={true}
      >
        <PopoverTrigger>
          <Button
            onClick={open}
            border="none"
            aria-label="Settings"
            leftIcon={
              <Icon
                as={isOpen ? MdOutlineCancel : MdOutlineSettings}
                w={6}
                h={6}
              />
            }
          >
            <Text variant="headerNav">Settings</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          borderColor="gray.100"
          width="fit-content"
          bgColor={contentBgColor}
        >
          <PopoverBody p={0} maxWidth="95vw">
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
