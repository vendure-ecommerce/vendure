import { manifest } from '../src/manifest.js';
import {
    testManifestMdx,
    formatTestReport,
    createProgressReporter,
    validateAdmonitions,
    formatAdmonitionReport,
} from '@vendure-io/docs-provider/testing';

async function main() {
    const verbose = process.argv.includes('--verbose');
    let hasErrors = false;

    // Validate admonition syntax
    console.log('Validating admonition syntax...\n');
    const admonitionReport = validateAdmonitions(manifest);

    if (admonitionReport.errors.length > 0) {
        console.log(formatAdmonitionReport(admonitionReport));
        hasErrors = true;
    } else {
        console.log(`✓ All admonitions valid (${admonitionReport.filesScanned} files scanned)\n`);
    }

    // Test MDX compilation
    console.log('Testing MDX files...\n');

    const report = await testManifestMdx(manifest, {
        onProgress: createProgressReporter(),
    });

    console.log('\n');
    console.log(formatTestReport(report, verbose));

    if (report.failed > 0) {
        hasErrors = true;
    }

    if (hasErrors) {
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
});
