import { generateAllCombinations } from './shared-utils';

describe('generateAllCombinations()', () => {
    it('works with an empty input array', () => {
        const result = generateAllCombinations([]);
        expect(result).toEqual([]);
    });

    it('works with an input of length 1', () => {
        const result = generateAllCombinations([['red', 'green', 'blue']]);
        expect(result).toEqual([['red'], ['green'], ['blue']]);
    });

    it('works with an input of length 2', () => {
        const result = generateAllCombinations([['red', 'green', 'blue'], ['small', 'large']]);
        expect(result).toEqual([
            ['red', 'small'],
            ['red', 'large'],
            ['green', 'small'],
            ['green', 'large'],
            ['blue', 'small'],
            ['blue', 'large'],
        ]);
    });

    it('works with second array empty', () => {
        const result = generateAllCombinations([['red', 'green', 'blue'], []]);
        expect(result).toEqual([['red'], ['green'], ['blue']]);
    });
});
