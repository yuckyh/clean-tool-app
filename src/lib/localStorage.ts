/**
 * @file This file contains utilities for localStorage.
 * @module lib/localStorage
 */

/**
 * The function to get a persisted value from localStorage.
 * @param key - The key to get the value from.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The value from localStorage if the key is found, otherwise the default value.
 * @example
 *  const foo = getPersisted('foo', 'bar') // foo === 'bar'
 */
export const getPersisted = <T extends string, K extends string>(
  key: K,
  defaultValue: T,
): T => (localStorage.getItem(key) ?? defaultValue) as T

/**
 * The function to set a persisted value in localStorage.
 * @param key - The key to set the value to.
 * @param value - The value to set.
 * @returns The value that was set.
 * @example
 *  const foo = setPersisted('foo', 'bar') // foo === 'bar'
 */
export const setPersisted = <T extends string, K extends string>(
  key: K,
  value: T,
) => {
  localStorage.setItem(key, value)
  return value
}
