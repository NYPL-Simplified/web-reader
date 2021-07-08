import { ThemeProvider } from '@chakra-ui/react';
import * as React from 'react';
import { UseWebReaderReturn } from '../useWebReader';
import SettingsCard from './SettingsButton';
import theme from './theme';

/**
 * The default Manager UI. This will be broken into individual components
 * that can be imported and used separately or in a customized setup.
 * It takes the return value of useWebReader as props
 */

const ManagerUI: React.FC<UseWebReaderReturn> = ({ children, navigator }) => {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'mistyrose',
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
          {/* <h1>{manifest?.metadata.title}</h1> */}
          <h1>No title</h1>
          <div>
            {navigator && <SettingsCard navigator={navigator} />}
            {/* <button style={{ margin: 4 }} onClick={navigator?.scroll}>
            scroll
          </button>
          <button style={{ margin: 4 }} onClick={navigator?.paginate}>
            paginate
          </button> */}
          </div>
        </nav>
        {children}
        <div
          style={{
            padding: 8,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex' }}>
            <button style={{ marginRight: 4 }} onClick={navigator?.goBackward}>
              {`<`} page
            </button>
          </div>
          {/* <div style={{ display: 'flex' }}>
          <select onChange={handleTocChange}>
            {toc?.map((item) => (
              <Option item={item} key={item.href} level={0} />
            ))}
          </select>
        </div> */}
          <div style={{ display: 'flex' }}>
            <button onClick={navigator?.goForward}>page {`>`}</button>
          </div>
        </div>
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
