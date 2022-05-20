import { ThemeProvider, Flex, Icon } from '@chakra-ui/react';
import * as React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FOOTER_HEIGHT } from '../constants';
import { ReaderManagerArguments, ReaderReturn } from '../types';
import Header from './Header';
import useColorModeValue from './hooks/useColorModeValue';
import PageButton from './PageButton';
import { getTheme } from './theme';

/**
 * The default Manager UI. This will be broken into individual components
 * that can be imported and used separately or in a customized setup.
 * It takes the return value of useWebReader as props
 */
const ManagerUI: React.FC<ReaderReturn & ReaderManagerArguments> = (props) => {
  return (
    <ThemeProvider theme={getTheme(props.state?.settings?.colorMode)}>
      <WebReaderContent {...props} />
    </ThemeProvider>
  );
};

const WebReaderContent: React.FC<ReaderReturn & ReaderManagerArguments> = ({
  children,
  headerLeft,
  ...props
}) => {
  const bgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isAtStart = props.state?.atStart;
  const isAtEnd = props.state?.atEnd;

  return (
    <Flex flexDir="column" w="100%" position="relative">
      {!props.isLoading && (
        <Header
          headerLeft={headerLeft}
          containerRef={containerRef}
          {...props}
        />
      )}

      <Flex
        as="main"
        ref={containerRef}
        position="relative"
        bg={bgColor}
        flexDir="column"
        alignItems="stretch"
        flex="1 1 auto"
      >
        {children}
      </Flex>

      <Flex
        as="footer"
        position="sticky"
        height={`${FOOTER_HEIGHT}px`}
        zIndex="docked"
        bottom="0"
        justifyContent="space-between"
        w="100%"
        bg={bgColor}
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <PageButton
          onClick={props.navigator?.goBackward}
          aria-label="Previous Page"
          disabled={isAtStart}
        >
          <Icon as={MdKeyboardArrowLeft} w={6} h={6} />
          Previous
        </PageButton>
        <PageButton
          onClick={props.navigator?.goForward}
          aria-label="Next Page"
          disabled={isAtEnd}
        >
          Next <Icon as={MdKeyboardArrowRight} w={6} h={6} />
        </PageButton>
      </Flex>
    </Flex>
  );
};

export default ManagerUI;
