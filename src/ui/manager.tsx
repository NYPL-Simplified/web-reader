import { ThemeProvider, Box } from '@chakra-ui/react';
import * as React from 'react';
import { ReaderReturn } from '../types';
import SettingsCard from './SettingsButton';
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
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
          }}
        >
          <h1>{manifest?.metadata.title}</h1>
          <div>
            {navigator && state && (
              <SettingsCard navigator={navigator} state={state} />
            )}
          </div>
        </nav>
        <Box
          className="ui-manager"
          maxWidth="unset"
          w="100vw"
          d="flex"
          justifyContent="space-evenly"
          flexWrap="nowrap"
        >
          <PageButton onClick={navigator?.goBackward}>{`<`}</PageButton>
          <Box className="ui-manager__content" width="100%">
            {children}
          </Box>
          <PageButton onClick={navigator?.goForward}>{`>`}</PageButton>
        </Box>
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
