import { ThemeProvider, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { ReaderReturn } from '../types';
import Header from './Header';
import PageButton from './PageButton';
import theme from './theme';

/**
 * The default Manager UI. This will be broken into individual components
 * that can be imported and used separately or in a customized setup.
 * It takes the return value of useWebReader as props
 */
const ManagerUI: React.FC<ReaderReturn> = ({
  children,
  navigator,
  state,
  manifest,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {navigator && state && manifest && (
          <Header
            readerState={state}
            navigator={navigator}
            manifest={manifest}
          />
        )}
        <Flex w="100vw" justifyContent="space-around">
          <PageButton onClick={navigator?.goBackward}>{`<`}</PageButton>
          {children}
          <PageButton onClick={navigator?.goForward}>{`>`}</PageButton>
        </Flex>
      </div>
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
