import { CurrencyNamePipe } from './currency-name.pipe';

describe('CurrencyNamePipe', () => {
    const pipe = new CurrencyNamePipe();
    it('full output', () => {
        expect(pipe.transform('usd')).toBe('US dollars ($)');
        expect(pipe.transform('gbp')).toBe('British pounds (£)');
        expect(pipe.transform('CNY')).toBe('Chinese yuan (CN¥)');
    });

    it('name output', () => {
        expect(pipe.transform('usd', 'name')).toBe('US dollars');
        expect(pipe.transform('gbp', 'name')).toBe('British pounds');
        expect(pipe.transform('CNY', 'name')).toBe('Chinese yuan');
    });

    it('symbol output', () => {
        expect(pipe.transform('usd', 'symbol')).toBe('$');
        expect(pipe.transform('gbp', 'symbol')).toBe('£');
        expect(pipe.transform('CNY', 'symbol')).toBe('CN¥');
    });

    it('returns code for unknown codes', () => {
        expect(pipe.transform('zzz')).toBe('ZZZ (ZZZ)');
    });

    it('returns empty string for empty input', () => {
        expect(pipe.transform('')).toBe('');
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('returns warning for invalid input', () => {
        expect(pipe.transform({} as any)).toBe('Invalid currencyCode "[object Object]"');
        expect(pipe.transform(false as any)).toBe('Invalid currencyCode "false"');
    });
});
