import { ThemeProvider, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { ReaderManagerArguments, ReaderReturn } from '../types';
import Footer from './Footer';
import Header from './Header';
import useColorModeValue from './hooks/useColorModeValue';
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

      <Footer state={props.state} navigator={props.navigator} />
    </Flex>
  );
};

export default ManagerUI;
