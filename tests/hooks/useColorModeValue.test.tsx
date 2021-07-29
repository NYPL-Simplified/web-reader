import * as React from 'react';
import { render, screen } from '@testing-library/react';
import useColorModeValue from '../../src/ui/hooks/useColorModeValue';
import { ThemeProvider } from '@chakra-ui/react';
import { getTheme } from '../../src/ui/theme';
import { ColorMode } from '../../src/types';

type ComponentWrapperType = {
  colorMode: ColorMode;
  children?: any;
};

const ComponentWrapper = ({ colorMode, children }: ComponentWrapperType) => {
  return <ThemeProvider theme={getTheme(colorMode)}>{children}</ThemeProvider>;
};

const testData = [
  { colorMode: 'day', value: 'color day' },
  { colorMode: 'night', value: 'color night' },
  { colorMode: 'sepia', value: 'color sepia' },
];

const ComponentWithHooks = () => {
  const color = useColorModeValue(
    testData[0].value,
    testData[1].value,
    testData[2].value
  );
  return <h1>{color}</h1>;
};

describe('Should render the correct color value per color mode', () => {
  for (let { colorMode, value } of testData) {
    test(`should see '${value}' text for '${colorMode}' mode`, () => {
      render(
        <ComponentWrapper colorMode={colorMode as ColorMode}>
          <ComponentWithHooks />
        </ComponentWrapper>
      );
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  }
});
