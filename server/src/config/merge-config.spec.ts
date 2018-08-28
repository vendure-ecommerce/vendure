import { mergeConfig } from './merge-config';

describe('mergeConfig()', () => {
    it('merges top-level properties', () => {
        const input: any = {
            a: 1,
            b: 2,
        };

        mergeConfig(input, { b: 3, c: 5 } as any);
        expect(input).toEqual({
            a: 1,
            b: 3,
            c: 5,
        });
    });

    it('merges deep properties', () => {
        const input: any = {
            a: 1,
            b: { c: 2 },
        };

        mergeConfig(input, { b: { c: 5 } } as any);
        expect(input).toEqual({
            a: 1,
            b: { c: 5 },
        });
    });

    it('replaces class instances rather than merging their properties', () => {
        class Foo {
            name = 'foo';
        }
        class Bar {
            name = 'bar';
        }

        const input: any = {
            class: new Foo(),
        };

        mergeConfig(input, { class: new Bar() } as any);

        expect(input.class instanceof Bar).toBe(true);
        expect(input.class.name).toBe('bar');
    });
});
