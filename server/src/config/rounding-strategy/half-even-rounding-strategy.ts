import { RoundingStrategy } from './rounding-strategy';

/**
 * The Half-even rounding strategy (also known as Banker's Rounding) will round a decimal of .5
 * to the nearest even number. This is intended to counteract the upward bias introduced by the
 * more well-known "round 0.5 upwards" method.
 *
 * Based on https://stackoverflow.com/a/49080858/772859
 */
export class HalfEvenRoundingStrategy implements RoundingStrategy {
    round(input: number): number {
        const r = Math.round(input);
        const br = Math.abs(input) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
        return br;
    }
}
