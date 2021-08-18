export default function throttle(
  func: (...args: any[]) => void,
  timeFrame: number
) {
  var lastTime = new Date(0);
  return function (...args: any[]) {
    var now = new Date();
    if (now.getTime() - lastTime.getTime() >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
