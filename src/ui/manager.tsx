import { ThemeProvider, Flex, Box } from '@chakra-ui/react';
import * as React from 'react';
import { ReaderReturn } from '../types';
import Header from './Header';
import PageButton from './PageButton';
import { getTheme } from './theme';

/**
 * The default Manager UI. This will be broken into individual components
 * that can be imported and used separately or in a customized setup.
 * It takes the return value of useWebReader as props
 */
const ManagerUI: React.FC<ReaderReturn> = ({ children, navigator, state }) => {
  return (
    <ThemeProvider theme={getTheme(state?.colorMode ?? 'day')}>
      <Flex flexDir="column">
        {navigator && state && (
          <Header readerState={state} navigator={navigator} />
        )}
        <Box w="100vw">
          <PageButton
            onClick={navigator?.goBackward}
            left={0}
          >{`<`}</PageButton>
          {children}
          <PageButton
            onClick={navigator?.goForward}
            right={0}
          >{`>`}</PageButton>
        </Box>
      </Flex>
    </ThemeProvider>
  );
};

// const Option: React.FC<{ item: TocItem; level: number }> = ({
//   item,
//   level = 0,
// }) => {
//   const indents = '\u00A0'.repeat(level * 2);
//   return (
//     <>
//       <option value={item.href} style={{ paddingLeft: 2 * level }}>
//         {indents}
//         {item.title}
//       </option>
//       {item.children?.map((child) => (
//         <Option item={child} level={level + 1} />
//       ))}
//     </>
//   );
// };

export default ManagerUI;
