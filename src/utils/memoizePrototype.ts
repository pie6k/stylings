import { DeepMap } from "./map/DeepMap";
import { EqualKeyMap } from "./map/EqualKeyMap";
import { memoizeFn } from "./memoize";

type AnyFunction = (...args: any[]) => any;

const methodCache = Symbol("memoize-method-cache");
const getterCache = Symbol("memoize-getter-cache");

type MethodCache = Map<string, DeepMap<unknown>>;

interface WithCache {
  [methodCache]: MethodCache;
  [getterCache]: Map<string, unknown>;
}

function getMethodCache(target: WithCache, propertyName: string) {
  let propertiesCache = target[methodCache];

  if (!propertiesCache) {
    propertiesCache = new Map();
    target[methodCache] = propertiesCache;
  }

  let cache = propertiesCache.get(propertyName);

  if (cache) return cache;

  cache = new DeepMap(Map);

  target[methodCache].set(propertyName, cache);

  return cache;
}

function createMemoizedMethod(originalMethod: AnyFunction, methodName: string) {
  return function (this: WithCache, ...args: any[]) {
    const cache = getMethodCache(this, methodName);

    return cache.boundGetOrCreateCallback(this, originalMethod, ...args);
  };
}

function getGetterCache(target: WithCache) {
  let propertiesCache = target[getterCache];

  if (!propertiesCache) {
    propertiesCache = new Map();
    target[getterCache] = propertiesCache;
  }

  return propertiesCache;
}

function createMemoizedGetter(originalGetter: AnyFunction, methodName: string) {
  return function (this: WithCache) {
    const cache = getGetterCache(this);

    let result = cache.get(methodName);

    if (result !== undefined || cache.has(methodName)) return result;

    result = originalGetter.call(this);

    cache.set(methodName, result);

    return result;
  };
}

/**
 * Memoizes all methods and getters on a prototype
 */
const memoizePrototype = memoizeFn(
  (prototype: object): void => {
    const propertyNames = Object.getOwnPropertyNames(prototype);

    for (const propertyName of propertyNames) {
      if (propertyName === "constructor") continue;

      const property = Object.getOwnPropertyDescriptor(prototype, propertyName)!;

      if (typeof property.value === "function") {
        Object.defineProperty(prototype, propertyName, {
          ...property,
          value: createMemoizedMethod(property.value, propertyName),
        });
      } else if (property.get) {
        Object.defineProperty(prototype, propertyName, {
          ...property,
          get: createMemoizedGetter(property.get, propertyName),
        });
      }
    }
  },
  { mode: "weak" },
);

/**
 * Memoizes all methods and getters in the prototype chain of the target instance.
 * This will affect all instances sharing these prototypes.
 */
export function memoizePrototypeOf<T extends object>(target: T): void {
  let proto = Object.getPrototypeOf(target);

  // Traverse the prototype chain
  while (proto && proto !== Object.prototype) {
    memoizePrototype(proto);
    proto = Object.getPrototypeOf(proto);
  }
}

/**
 * Memoizes all methods and getters of a class.
 * This will affect all instances of the class.
 */
export function memoizeClass(classConstructor: Function): void {
  memoizePrototype(classConstructor.prototype);
}
