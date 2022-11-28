import * as React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FOOTER_HEIGHT } from '../constants';
import PageButton from './PageButton';
import { Navigator, ReaderState } from '../types';
import useColorModeValue from './hooks/useColorModeValue';

type FooterProps = {
  state: ReaderState | null;
  navigator: Navigator | null;
} & React.ComponentProps<typeof Flex>;

const Footer: React.FC<FooterProps> = ({
  state,
  navigator,
  ...rest
}): JSX.Element => {
  const bgColor = useColorModeValue(
    'ui.gray.light-warm',
    'ui.black',
    'ui.sepia'
  );
  const isAtStart = state?.atStart;
  const isAtEnd = state?.atEnd;
  return (
    <Flex
      as="footer"
      position="sticky"
      height={`${FOOTER_HEIGHT}px`}
      zIndex="sticky"
      bottom="0"
      justifyContent="space-between"
      w="100%"
      bg={bgColor}
      borderTop="1px solid"
      borderColor="gray.100"
      {...rest}
    >
      <PageButton
        onClick={navigator?.goBackward}
        aria-label="Previous Page"
        disabled={isAtStart}
      >
        <Icon as={MdKeyboardArrowLeft} w={6} h={6} />
        Previous
      </PageButton>
      <PageButton
        onClick={navigator?.goForward}
        aria-label="Next Page"
        disabled={isAtEnd}
      >
        Next <Icon as={MdKeyboardArrowRight} w={6} h={6} />
      </PageButton>
    </Flex>
  );
};

export default Footer;
