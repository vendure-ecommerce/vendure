import { RoundingStrategy } from './rounding-strategy';

/**
 * Rounds decimals of 0.5 up to the next integer in the direction of + infinity.
 */
export class HalfUpRoundingStrategy implements RoundingStrategy {
    round(input: number): number {
        return Math.round(input);
    }
}
