import { manifest } from '../src/manifest';
import {
    testManifestMdx,
    formatTestReport,
    createProgressReporter,
} from '@vendure-io/docs-provider/testing';

async function main() {
    console.log('Testing MDX files...\n');

    const report = await testManifestMdx(manifest, {
        onProgress: createProgressReporter(),
    });

    console.log('\n');
    console.log(formatTestReport(report, process.argv.includes('--verbose')));

    if (report.failed > 0) {
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
});
