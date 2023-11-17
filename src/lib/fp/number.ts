/**
 * @file This file contains the utilities for working with numbers in a functional way.
 */

/**
 * The function to add two numbers together.
 * @param x - The first number.
 * @returns A function that takes a number and adds it to the first number.
 * @example
 *  const ten = add(5)(5) // ten === 10
 */
export const add = (x: number) => (y: number) => x + y

/**
 * The function to multiply two numbers together.
 * @param x - The first number.
 * @returns A function that takes a number and multiplies it by the first number.
 * @example
 *  const twentyFive = multiply(5)(5) // twentyFive === 25
 */
export const multiply = (x: number) => (y: number) => x * y

/**
 * The function to divide two numbers.
 * @param x - The first number.
 * @returns A function that takes a number and divides it by the first number.
 * @example
 *  const five = divideBy(25)(5) // five === 5
 */
export const divideBy = (x: number) => (y: number) => x / y

/**
 * The function to compare whether the first is greater than or equal to the second.
 * @param x - The first number.
 * @returns A function that takes a number and compares it to the first number.
 * @example
 *  const isGreaterThanOrEqualToFive = gte(5) // isGreaterThanOrEqualToFive(5) === true
 */
export const gte = (x: number) => (y: number) => x >= y

/**
 * The function to compare whether the first is less than or equal to the second.
 * @param x - The first number.
 * @returns A function that takes a number and compares it to the first number.
 * @example
 *  const isLessThanOrEqualToFive = lte(5) // isLessThanOrEqualToFive(5) === true
 */
export const lte = (x: number) => (y: number) => x <= y

/**
 * The function to compare whether the first is greater than the second.
 * @param x - The first number.
 * @returns A function that takes a number and compares it to the first number.
 * @example
 *  const isGreaterThanFive = gt(5) // isGreaterThanFive(5) === false
 */
export const gt = (x: number) => (y: number) => x > y

/**
 * The function to compare whether the first is less than the second.
 * @param x - The first number.
 * @returns A function that takes a number and compares it to the first number.
 * @example
 *  const isLessThanFive = lt(5) // isLessThanFive(5) === false
 */
export const lt = (x: number) => (y: number) => x < y
