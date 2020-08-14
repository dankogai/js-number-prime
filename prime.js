/**
 * prime.ts
 *
 * @author Dan Kogai
 */
const version = '0.0.0';
const _BI = typeof BigInt === 'function' ? BigInt : Number;
//
const halve = typeof BigInt === 'function'
    ? n => n.constructor(_BI(n) >> _BI(1))
    : n => n.constructor(Math.floor(n / 2));
/**
 *
 */
export const mulmod = typeof BigInt === 'function'
    ? (a, b, m) => a.constructor((_BI(a) * _BI(b)) % _BI(m))
    : (a, b, m) => {
        let r = 0;
        a %= m;
        while (0 < b) {
            if (b % 2 === 1)
                r = (r + a) % m;
            a = (a * 2) % m;
            b = Math.floor(b / 2);
        }
        return r;
    };
/**
 * @param b base
 * @param e exponent
 * @param m modulus
 * @returns `(b ** e) mod m`
 */
export function powmod(b, e, m) {
    const [zero, one, two] = [_BI(0), _BI(1), _BI(2)];
    let [bb, be, bm] = [_BI(b), _BI(e), _BI(m)];
    let br = one;
    while (zero < be) {
        if (be % two === one)
            br = mulmod(br, bb, bm);
        bb = mulmod(bb, bb, bm);
        be = halve(be);
    }
    return b.constructor(br);
}
/**
 * @link https://en.wikipedia.org/wiki/Miller–Rabin_primality_test
 * @param a
 */
export function millerRabinTest(a) {
    return function (n) {
        const [zero, one, two] = [_BI(0), _BI(1), _BI(2)];
        const [ba, bn] = [_BI(a), _BI(n)];
        let bd = bn - one;
        while (bd % two === zero) {
            bd = halve(bd);
        }
        let bt = bd;
        let by = _BI(powmod(ba, bt, bn));
        while (bt !== bn - one && by !== one && by !== bn - one) {
            by = mulmod(by, by, bn);
            bt *= two;
        }
        return by === bn - one || bt % two === one;
    };
}
/**
 * @link https://oeis.org/A014233
 */
export const A014233 = new Map([
    [2, _BI('2047')],
    [3, _BI('1373653')],
    [5, _BI('25326001')],
    [7, _BI('3215031751')],
    [11, _BI('2152302898747')],
    [13, _BI('3474749660383')],
    [17, _BI('341550071728321')],
    [19, _BI('341550071728321')],
    [23, _BI('3825123056546413051')],
    [29, _BI('3825123056546413051')],
    [31, _BI('3825123056546413051')],
    [37, _BI('318665857834031151167461')],
    [41, _BI('3317044064679887385961981')]
]);
export const millerRabinTests = ((m) => {
    let tests = new Map();
    for (const k of m.keys()) {
        tests.set(k, millerRabinTest(k));
    }
    return tests;
})(A014233);
/**
 *
 */
export function isMersennePrime(n) {
    let bn = _BI(n);
    if ((bn & (bn + _BI(1))) !== _BI(0))
        return undefined;
    const bits = bn.toString(2).length;
    if (!isPrime(bits))
        return false;
    let bs = _BI(4);
    const bbits = _BI(bits);
    const two = _BI(2);
    // for (let i = 2; i < bits; i++) {
    //     bs = (bs * bs - _BI(2)) % bn;
    //     // console.log(i, bs);
    // }
    for (let i = 2; i < bits; i++) {
        let bs2 = bs * bs;
        bs = (bs2 & bn) + (bs2 >> bbits);
        if (bn <= bs)
            bs -= bn;
        bs -= two;
        // console.log(i, bs);
    }
    return bs == 0;
}
/**
 * @param n
 */
export function isProbablyPrime(n) {
    if (typeof n === 'number') {
        if (!Number.isInteger(n))
            return [false, true];
        if (Number.MAX_SAFE_INTEGER < n)
            return [false, false];
    }
    if (n < 2)
        return [false, true];
    const bn = _BI(n);
    const [b0, b2, b3, b5, b7] = [0, 2, 3, 5, 7].map(v => _BI(v));
    if (bn % b2 === b0)
        return [bn === b2, true];
    if (bn % b3 === b0)
        return [bn === b3, true];
    if (bn % b5 === b0)
        return [bn === b5, true];
    if (bn % b7 === b0)
        return [bn === b7, true];
    for (const [p, test] of millerRabinTests.entries()) {
        // console.log(`p = ${p}, A014233.get(${p}) = ${A014233.get(p)}`);
        if (millerRabinTests.get(p)(bn) === false)
            return [false, true];
        if (bn < A014233.get(p))
            return [true, true];
    }
    // check Mersenne Prime
    const mp = isMersennePrime(bn);
    if (mp !== undefined)
        return [mp, true];
    // try more till n < (4 ** k) <=> k > log(n) / log(2) == lg(2) / 2;
    const k = Math.ceil(n.toString(4).length);
    for (let i = A014233.size, p = nextPrime(41); i < k; i++, p = nextPrime(p)) {
        if (millerRabinTest(Number(p))(bn) === false)
            return [false, true];
    }
    // could not disprove n was a prime so report it with # of trials
    return [true, false, k];
}
/**
 * @param n
 */
export function isPrime(n) {
    const [prime, sure] = isProbablyPrime(n);
    if (sure)
        return prime;
    throw RangeError(`${n} is probably${prime ? ' ' : ' not '}a prime but not for sure.`);
}
/**
 * @param n
 */
export function nextPrime(n) {
    const ctor = n.constructor;
    const [zero, one, two] = [ctor(0), ctor(1), ctor(2)];
    let bp = n < two ? two
        : typeof n === 'number' && !Number.isInteger(n)
            ? ctor(Math.ceil(n))
            : ctor(n) + one;
    if (bp === two)
        return ctor(two);
    if (bp % two === zero)
        bp++;
    while (true) {
        const [prime, sure] = isProbablyPrime(bp);
        if (!sure)
            return undefined;
        if (prime)
            return ctor(bp);
        bp += two;
    }
}
/**
 * @param n
 */
export function previousPrime(n) {
    if (n < 2)
        return undefined;
    const ctor = n.constructor;
    const [zero, one, two] = [ctor(0), ctor(1), ctor(2)];
    let bp = typeof n === 'number' && !Number.isInteger(n)
        ? ctor(Math.floor(n))
        : ctor(n) - one;
    if (bp === two)
        return ctor(two);
    if (bp % two === zero)
        bp--;
    while (2 <= bp) {
        const [prime, sure] = isProbablyPrime(bp);
        if (!sure)
            return undefined;
        if (prime)
            return ctor(bp);
        bp -= two;
    }
    return undefined;
}
/**
 * generates `n` primes.
 * If `n` is `BigInt`, generated primes are also `BigInt`.
 * If `n` is omitted, it returns an infinite iterator.
 */
export function* primes(n = Number.POSITIVE_INFINITY) {
    const ctor = n.constructor;
    for (let p = ctor(2), i = 0; i < n; i++, p = nextPrime(p))
        yield p;
}
/**
 * generates primes where `begin <= p < end`
 */
export function* primesBetween(begin = 2, end = Number.POSITIVE_INFINITY) {
    if (end < begin)
        return primesBetween(end, begin);
    let p = isPrime(begin) ? begin : nextPrime(begin);
    while (p < end) {
        yield p;
        p = nextPrime(p);
    }
}
