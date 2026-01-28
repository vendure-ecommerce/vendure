import { generateDatesFile } from '@vendure-io/docs-provider';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const result = await generateDatesFile({
    docsDir: join(packageRoot, 'docs'),
    outputPath: join(packageRoot, 'src/dates.generated.ts'),
    gitCwd: packageRoot,
});

console.log(`Generated dates.generated.ts`);
console.log(`  Files with dates: ${result.filesWithDates}`);
console.log(`  Files skipped: ${result.filesSkipped}`);
