import React, { FC } from 'react';
import { UseWebReaderReturn } from './useWebReader';

/**
 * The default Manager UI. This will be broken into individual components
 * that can be imported and used separately or in a customized setup.
 * It takes the return value of useWebReader as props
 */

const ManagerUI: FC<UseWebReaderReturn> = ({
  toc,
  title,
  handleNextPage,
  handlePrevPage,
  handleTocChange,
  children,
}) => {
  return (
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
        <h1>{title}</h1>
        <button>settings</button>
      </nav>
      {children}
      <div
        style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex' }}>
          <button onClick={handlePrevPage}> {`<`} page</button>
        </div>
        <div style={{ display: 'flex' }}>
          <select onChange={handleTocChange}>
            {toc?.map((sect) => (
              <option value={sect.href} key={sect.href}>
                {sect.title}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex' }}>
          <button onClick={handleNextPage}>page {`>`}</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerUI;
