export default function throttle(
  func: (...args: any[]) => void,
  timeFrame: number
) {
  let lastTime = new Date(0);
  return function (...args: any[]) {
    const now = new Date();
    if (now.getTime() - lastTime.getTime() >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
