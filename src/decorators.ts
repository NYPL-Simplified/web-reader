/**
 * This decorator is to help sync up the class-based state of R2D2BC's
 * reader with the value based state of React. React needs to know when
 * the class is mutated in order to re-render. Thus we provide a simple hook
 * that tells react something has changed.
 */
export function mutating(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  if (!('didMutate' in target)) {
    console.error('didMutate missing from target', target);
    return descriptor;
  }
  const { didMutate } = target;
  if (!(didMutate instanceof Function)) {
    console.error('didMutate not instance of function', didMutate);
    return descriptor;
  }

  descriptor.value = function (...args: any) {
    const result = originalMethod.apply(this, args);
    didMutate.apply(this);
    return result;
  };

  return descriptor;
}
