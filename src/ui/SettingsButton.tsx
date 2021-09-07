import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
} from '@chakra-ui/react';
import { PDFActiveReader, HTMLActiveReader } from '../types';
import { Icon, IconNames } from '@nypl/design-system-react-components';

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
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const { navigator, state, type } = props;
  const paginationValue = state?.isScrolling ? 'scrolling' : 'paginated';
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
            {type === 'PDF' && (
              <PdfSettings
                navigator={navigator}
                readerState={state}
                paginationValue={paginationValue}
              />
            )}
            {type === 'HTML' && (
              <HtmlSettings
                navigator={navigator}
                readerState={state}
                paginationValue={paginationValue}
              />
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
