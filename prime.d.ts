/**
 *
 */
declare type anyint = number | bigint;
/**
 *
 */
export declare const mulmod: (a: anyint, b: anyint, m: anyint) => any;
/**
 * @param b base
 * @param e exponent
 * @param m modulus
 * @returns `(b ** e) mod m`
 */
export declare function powmod(b: anyint, e: anyint, m: anyint): anyint;
/**
 * @link https://en.wikipedia.org/wiki/Miller–Rabin_primality_test
 * @param a
 */
export declare function millerRabinTest(a: number): (n: anyint) => boolean;
/**
 * @link https://oeis.org/A014233
 */
export declare const A014233: Map<number, number>;
export declare const millerRabinTests: Map<any, any>;
/**
 *
 */
export declare function isMersennePrime(n: anyint): boolean;
/**
 * Checks if `n` is a prime.
 * Returns a pair of `boolean`s in an array.
 * - `[0]` is primarity.  `true` if prime, `false` if composite
 * - `[1]` is certainity.
 *   - `true` if the result is 100% sure.
 *   - `false` if the result is probable.
 * - `[2]` (optional) the number of Miller-Rabin Tests applied.
 * @param {anyint} n integer to check primarity
 * @param {number} nmrt maximum number of Miller-Rabin Tests to apply
 * @returns {boolean[]} `[primarity, certaininty]`
 */
export declare function isProbablyPrime(n: anyint, nmrt?: number): (number | boolean)[];
/**
 * Checks if `n` is a prime.  If not certain throws a `RangeError`.
 * If you want to check what hass happen
 * @param {anyint} n integer to check primarity
 */
export declare function isPrime(n: anyint): number | boolean;
/**
 * find the next prime.
 *
 * @param {anyint} n the starting integer.
 * @param {boolean} unsure if `true` probable primes become accepted.
 * @param {number} nmrt the number of Miller-Rabin Tests to apply.
 * @returns {anyint} the next prime number or `undefined` if not found
 */
export declare function nextPrime(n: anyint, unsure?: boolean, nmrt?: number): anyint;
/**
 * find the previous prime.
 *
 * @param {anyint} n the starting integer.
 * @param {boolean} unsure if `true` probable primes become accepted.
 * @param {number} nmrt the number of Miller-Rabin Tests to apply.
 * @returns {anyint} the previous prime number or `undefined` if not found
 */
export declare function previousPrime(n: anyint, unsure?: boolean, nmrt?: number): anyint;
/**
 * generates `n` primes.
 * If `n` is `BigInt`, generated primes are also `BigInt`.
 * If `n` is omitted, it returns an infinite iterator.
 */
export declare function primes(n?: number): Generator<any, void, unknown>;
/**
 * generates primes where `begin <= p <= end`
 */
export declare function primesBetween(begin?: anyint, end?: anyint, unsure?: boolean, nmrt?: number): any;
export {};
