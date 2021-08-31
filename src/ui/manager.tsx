import { ThemeProvider, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { ReaderReturn } from '../types';
import Header from './Header';
import useColorModeValue from './hooks/useColorModeValue';
import PageButton from './PageButton';
import { getTheme } from './theme';

/**
 * The default Manager UI. This will be broken into individual components
 * that can be imported and used separately or in a customized setup.
 * It takes the return value of useWebReader as props
 */
const ManagerUI: React.FC<ReaderReturn> = (props) => {
  return (
    <ThemeProvider theme={getTheme(props.state?.colorMode ?? 'day')}>
      <WebReaderContent {...props} />
    </ThemeProvider>
  );
};

const WebReaderContent: React.FC<ReaderReturn> = ({
  children,
  navigator,
  state,
  manifest,
}) => {
  const bgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  return (
    <Flex flexDir="column" minHeight="100vh" w="100vw">
      {navigator && state && manifest && (
        <Header readerState={state} navigator={navigator} manifest={manifest} />
      )}
      <PageButton
        onClick={navigator?.goBackward}
        left={0}
        aria-label="Previous Page"
      >{`<`}</PageButton>
      <Flex
        width="100vw"
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
        onClick={navigator?.goForward}
        right={0}
        aria-label="Next Page"
      >{`>`}</PageButton>
    </Flex>
  );
};

export default ManagerUI;
