import { renderHook } from '@testing-library/react-hooks';
import useContainerWidth from '../../src/ui/hooks/useContainerWidth';

describe('useWindowWidth()', () => {
  it('should return window.innerWidth by default', () => {
    const { result } = renderHook(() => useContainerWidth('hello'));

    expect(result.current).toBe(window.innerWidth);
  });
});
