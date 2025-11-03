#!/usr/bin/env node

/**
 * Aggregates test results from GitHub Actions workflow and generates a markdown table
 * for PR comments showing build, unit test, and e2e test status across packages and environments.
 */

const fs = require('fs');
const path = require('path');

// Job status emojis
const STATUS = {
    success: '✅',
    failure: '❌',
    running: '🔄',
    skipped: '⏭️',
    pending: '⏳',
};

// Node versions being tested
const NODE_VERSIONS = ['20.x', '22.x', '24.x'];
const DB_TYPES = ['sqljs', 'postgres', 'mysql', 'mariadb'];

/**
 * Get affected packages from artifacts or environment
 */
function getAffectedPackages() {
    try {
        const artifactPath = process.env.AFFECTED_PACKAGES_PATH || 'artifacts/affected-packages/affected-packages.json';
        if (fs.existsSync(artifactPath)) {
            const packages = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
            return packages.map(pkg => pkg.name);
        }
    } catch (error) {
        console.error('Error reading affected packages:', error);
    }

    // Fallback: return empty array if no packages found
    return [];
}

/**
 * Get job statuses from GitHub Actions context
 */
function getJobStatuses() {
    const jobStatusesPath = process.env.JOB_STATUSES_PATH || 'job-statuses.json';

    if (fs.existsSync(jobStatusesPath)) {
        return JSON.parse(fs.readFileSync(jobStatusesPath, 'utf8'));
    }

    // Default statuses structure
    return {
        build: {},
        'unit-tests': {},
        'e2e-tests-sqljs': {},
        'e2e-tests-postgres': {},
        'e2e-tests-mysql': {},
        'e2e-tests-mariadb': {},
    };
}

/**
 * Format status for a specific node version
 */
function formatNodeStatus(jobStatuses, jobName, nodeVersion) {
    const key = `${jobName}-${nodeVersion}`;
    const status = jobStatuses[jobName]?.[nodeVersion];

    if (!status || status === 'pending') return STATUS.pending;
    if (status === 'running' || status === 'in_progress') return STATUS.running;
    if (status === 'success') return STATUS.success;
    if (status === 'failure') return STATUS.failure;
    if (status === 'skipped') return STATUS.skipped;

    return STATUS.pending;
}

/**
 * Format status cell for all node versions
 */
function formatStatusCell(jobStatuses, jobName) {
    return NODE_VERSIONS.map(version =>
        formatNodeStatus(jobStatuses, jobName, version)
    ).join(' ');
}

/**
 * Check if package was tested based on affected packages
 */
function wasPackageTested(packageName, affectedPackages) {
    return affectedPackages.length === 0 || affectedPackages.includes(packageName);
}

/**
 * Get all packages in the monorepo
 */
function getAllPackages() {
    try {
        // Read from lerna.json or package.json to get package locations
        const lernaPath = path.join(process.cwd(), 'lerna.json');
        if (fs.existsSync(lernaPath)) {
            const lerna = JSON.parse(fs.readFileSync(lernaPath, 'utf8'));
            const packageDirs = lerna.packages || ['packages/*'];

            const packages = [];
            packageDirs.forEach(pattern => {
                const packagesDir = pattern.replace('/*', '');
                if (fs.existsSync(packagesDir)) {
                    const dirs = fs.readdirSync(packagesDir);
                    dirs.forEach(dir => {
                        const pkgJsonPath = path.join(packagesDir, dir, 'package.json');
                        if (fs.existsSync(pkgJsonPath)) {
                            const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
                            packages.push(pkgJson.name);
                        }
                    });
                }
            });

            return packages.sort();
        }
    } catch (error) {
        console.error('Error getting all packages:', error);
    }

    return [];
}

/**
 * Generate markdown table for test results
 */
function generateMarkdownTable(affectedPackages, jobStatuses) {
    const allPackages = getAllPackages();

    if (allPackages.length === 0) {
        return '⚠️ No packages found in monorepo.';
    }

    // Build header
    const header = [
        '| Package | Build | Unit Tests | E2E (sqljs) | E2E (postgres) | E2E (mysql) | E2E (mariadb) |',
        '|---------|-------|------------|-------------|----------------|-------------|---------------|',
    ];

    // Build rows
    const rows = allPackages.map(pkg => {
        const isTested = wasPackageTested(pkg, affectedPackages);
        const skippedCell = `${STATUS.skipped} ${STATUS.skipped} ${STATUS.skipped}`;

        const buildStatus = isTested ? formatStatusCell(jobStatuses, 'build') : skippedCell;
        const unitStatus = isTested ? formatStatusCell(jobStatuses, 'unit-tests') : skippedCell;
        const sqlJsStatus = isTested ? formatStatusCell(jobStatuses, 'e2e-tests-sqljs') : skippedCell;
        const postgresStatus = isTested ? formatStatusCell(jobStatuses, 'e2e-tests-postgres') : skippedCell;
        const mysqlStatus = isTested ? formatStatusCell(jobStatuses, 'e2e-tests-mysql') : skippedCell;
        const mariadbStatus = isTested ? formatStatusCell(jobStatuses, 'e2e-tests-mariadb') : skippedCell;

        return `| ${pkg} | ${buildStatus} | ${unitStatus} | ${sqlJsStatus} | ${postgresStatus} | ${mysqlStatus} | ${mariadbStatus} |`;
    });

    return [...header, ...rows].join('\n');
}

/**
 * Calculate summary statistics
 */
function generateSummary(affectedPackages, jobStatuses) {
    const affectedCount = affectedPackages.length;
    const totalPackages = getAllPackages().length;

    let summary = `## Test Results Summary\n\n`;

    if (affectedCount === 0) {
        summary += `**All ${totalPackages} packages** are being tested.\n\n`;
    } else {
        summary += `**${affectedCount} of ${totalPackages} packages** affected by this PR.\n\n`;
    }

    summary += `**Node Versions:** ${NODE_VERSIONS.join(', ')}\n\n`;
    summary += `### Status Legend\n`;
    summary += `${STATUS.success} Passed | ${STATUS.failure} Failed | ${STATUS.running} Running | ${STATUS.pending} Pending | ${STATUS.skipped} Skipped\n\n`;
    summary += `*Each status column shows results for Node versions: 20.x, 22.x, 24.x*\n\n`;

    return summary;
}

/**
 * Main function
 */
function main() {
    console.log('Aggregating test results...');

    const affectedPackages = getAffectedPackages();
    const jobStatuses = getJobStatuses();

    console.log('Affected packages:', affectedPackages.length);
    console.log('Job statuses:', JSON.stringify(jobStatuses, null, 2));

    const summary = generateSummary(affectedPackages, jobStatuses);
    const table = generateMarkdownTable(affectedPackages, jobStatuses);

    const markdown = `${summary}${table}\n\n---\n*Updated: ${new Date().toISOString()}*`;

    // Write to output file
    const outputPath = process.env.OUTPUT_PATH || 'test-summary.md';
    fs.writeFileSync(outputPath, markdown);

    console.log(`Test summary written to ${outputPath}`);
    console.log('\n' + markdown);
}

if (require.main === module) {
    main();
}

module.exports = { getAffectedPackages, generateMarkdownTable, generateSummary };
