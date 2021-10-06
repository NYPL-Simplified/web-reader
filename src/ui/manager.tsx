import { ThemeProvider, Flex, Icon } from '@chakra-ui/react';
import * as React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
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
    <ThemeProvider theme={getTheme(props.state?.colorMode ?? 'day')}>
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
  return (
    <Flex flexDir="column" minHeight="100vh" w="100vw">
      {!props.isLoading && <Header headerLeft={headerLeft} {...props} />}
      <PageButton
        onClick={props.navigator?.goBackward}
        left={0}
        aria-label="Previous Page"
      >
        <Icon as={MdKeyboardArrowLeft} w={6} h={6} />
      </PageButton>
      <Flex
        bg={bgColor}
        // accounting for the prev/next buttons
        px={{ sm: 10, md: '5vw' }}
        flexDir="column"
        alignItems="stretch"
        flex="1 1 100%"
      >
        {children}
      </Flex>
      <PageButton
        onClick={props.navigator?.goForward}
        right={0}
        aria-label="Next Page"
      >
        <Icon as={MdKeyboardArrowRight} w={6} h={6} />
      </PageButton>
    </Flex>
  );
};

export default ManagerUI;
