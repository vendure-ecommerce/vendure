import { DefaultAssetNamingStrategy } from './default-asset-naming-strategy';

describe('DefaultAssetNamingStrategy', () => {
    describe('generateSourceFileName()', () => {
        it('normalizes file names', () => {
            const strategy = new DefaultAssetNamingStrategy();

            expect(strategy.generateSourceFileName('foo.jpg')).toBe('foo.jpg');
            expect(strategy.generateSourceFileName('curaçao.jpg')).toBe('curacao.jpg');
            expect(strategy.generateSourceFileName('dấu hỏi.jpg')).toBe('dau-hoi.jpg');
        });

        it('increments conflicting file names', () => {
            const strategy = new DefaultAssetNamingStrategy();

            expect(strategy.generateSourceFileName('foo.jpg', 'foo.jpg')).toBe('foo__02.jpg');
            expect(strategy.generateSourceFileName('foo.jpg', 'foo__02.jpg')).toBe('foo__03.jpg');
            expect(strategy.generateSourceFileName('foo.jpg', 'foo__09.jpg')).toBe('foo__10.jpg');
            expect(strategy.generateSourceFileName('foo.jpg', 'foo__99.jpg')).toBe('foo__100.jpg');
            expect(strategy.generateSourceFileName('foo.jpg', 'foo__999.jpg')).toBe('foo__1000.jpg');

            expect(strategy.generateSourceFileName('ext45000000000505', 'ext45000000000505')).toBe('ext45000000000505__02');
            expect(strategy.generateSourceFileName('ext45000000000505', 'ext45000000000505_002')).toBe('ext45000000000505__03');
        });
    });

    describe('generatePreviewFileName()', () => {
        it('adds the preview suffix', () => {
            const strategy = new DefaultAssetNamingStrategy();

            expect(strategy.generatePreviewFileName('foo.jpg')).toBe('foo__preview.jpg');
        });

        it('preserves the extension of supported image files', () => {
            const strategy = new DefaultAssetNamingStrategy();

            expect(strategy.generatePreviewFileName('foo.jpg')).toBe('foo__preview.jpg');
            expect(strategy.generatePreviewFileName('foo.jpeg')).toBe('foo__preview.jpeg');
            expect(strategy.generatePreviewFileName('foo.png')).toBe('foo__preview.png');
            expect(strategy.generatePreviewFileName('foo.webp')).toBe('foo__preview.webp');
            expect(strategy.generatePreviewFileName('foo.tiff')).toBe('foo__preview.tiff');
        });

        it('adds a png extension for unsupported images and other files', () => {
            const strategy = new DefaultAssetNamingStrategy();

            expect(strategy.generatePreviewFileName('foo.svg')).toBe('foo__preview.svg.png');
            expect(strategy.generatePreviewFileName('foo.gif')).toBe('foo__preview.gif.png');
            expect(strategy.generatePreviewFileName('foo.pdf')).toBe('foo__preview.pdf.png');
        });
    });
});
