#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalize paths to ensure cross-platform compatibility
const normalizePath = p => path.normalize(p);

// Check if we're running from the dashboard directory or root directory
const currentDir = normalizePath(process.cwd());
const isDashboardDir = currentDir.endsWith(normalizePath('packages/dashboard'));
const HOOKS_DIR = isDashboardDir
    ? normalizePath(path.join(__dirname, '../src/lib/hooks'))
    : normalizePath(path.join(currentDir, 'packages/dashboard/src/lib/hooks'));
const DASHBOARD_SRC_DIR = isDashboardDir
    ? normalizePath(path.join(__dirname, '../src'))
    : normalizePath(path.join(currentDir, 'packages/dashboard/src'));

// Required prefix for imports in hook files
const REQUIRED_PREFIX = '@/vdb';
// Banned import pattern
const BANNED_IMPORT = '@/vdb/index.js';

function findHookFiles(dir) {
    const files = [];

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = normalizePath(path.join(dir, item));
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && item.startsWith('use-') && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
            files.push(fullPath);
        }
    }

    return files;
}

function findDashboardFiles(dir) {
    const files = [];

    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = normalizePath(path.join(currentDir, item));
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
                    scanDirectory(fullPath);
                }
            } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
                files.push(fullPath);
            }
        }
    }

    scanDirectory(dir);
    return files;
}

function checkFileForBadImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const badImports = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('import')) {
            if (trimmedLine.includes('../')) {
                badImports.push({
                    line: i + 1,
                    content: trimmedLine,
                    reason: 'Relative imports going up directories (../) are not allowed in hook files',
                });
            }

            if (trimmedLine.includes('@/') && !trimmedLine.includes(REQUIRED_PREFIX)) {
                badImports.push({
                    line: i + 1,
                    content: trimmedLine,
                    reason: `Import must start with ${REQUIRED_PREFIX}`,
                });
            }
        }
    }

    return badImports;
}

function checkFileForBannedImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const badImports = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('import') && trimmedLine.includes(BANNED_IMPORT)) {
            badImports.push({
                line: i + 1,
                content: trimmedLine,
                reason: `Import from '${BANNED_IMPORT}' is not allowed anywhere in the dashboard app`,
            });
        }
    }

    return badImports;
}

function main() {
    console.log('🔍 Checking for import patterns in the dashboard app...\n');

    console.log('📁 Checking hook files (use-*.ts/tsx) in src/lib/hooks directory...');
    console.log('✅ Hook file requirements:');
    console.log(`   - All imports must start with ${REQUIRED_PREFIX}`);
    console.log('   - Relative imports going up directories (../) are not allowed');
    console.log('   - Relative imports in same directory (./) are allowed');
    console.log('');

    if (!fs.existsSync(HOOKS_DIR)) {
        console.error('❌ src/lib/hooks directory not found!');
        process.exit(1);
    }

    const hookFiles = findHookFiles(HOOKS_DIR);
    let hasBadImports = false;
    let totalBadImports = 0;

    for (const file of hookFiles) {
        const relativePath = normalizePath(path.relative(process.cwd(), file));
        const badImports = checkFileForBadImports(file);

        if (badImports.length > 0) {
            hasBadImports = true;
            totalBadImports += badImports.length;

            console.log(`❌ ${relativePath}:`);
            for (const badImport of badImports) {
                console.log(`   Line ${badImport.line}: ${badImport.content}`);
                console.log(`      Reason: ${badImport.reason}`);
            }
            console.log('');
        }
    }

    if (hasBadImports) {
        console.log(`❌ Found ${totalBadImports} bad import(s) in ${hookFiles.length} hook file(s)`);
        console.log(
            `💡 All imports in hook files must start with ${REQUIRED_PREFIX} and must not use relative paths going up directories`,
        );
    } else {
        console.log(`✅ No bad imports found in ${hookFiles.length} hook file(s)`);
        console.log(`🎉 All imports in hook files are using ${REQUIRED_PREFIX} prefix`);
    }

    console.log('\n📁 Checking all dashboard files for banned imports...');
    console.log('✅ Dashboard-wide requirements:');
    console.log(`   - Import from '${BANNED_IMPORT}' is not allowed anywhere`);
    console.log('');

    if (!fs.existsSync(DASHBOARD_SRC_DIR)) {
        console.error('❌ src directory not found!');
        process.exit(1);
    }

    const dashboardFiles = findDashboardFiles(DASHBOARD_SRC_DIR);
    let hasBannedImports = false;
    let totalBannedImports = 0;

    for (const file of dashboardFiles) {
        const relativePath = normalizePath(path.relative(process.cwd(), file));
        const bannedImports = checkFileForBannedImports(file);

        if (bannedImports.length > 0) {
            hasBannedImports = true;
            totalBannedImports += bannedImports.length;

            console.log(`❌ ${relativePath}:`);
            for (const bannedImport of bannedImports) {
                console.log(`   Line ${bannedImport.line}: ${bannedImport.content}`);
                console.log(`      Reason: ${bannedImport.reason}`);
            }
            console.log('');
        }
    }

    if (hasBannedImports) {
        console.log(
            `❌ Found ${totalBannedImports} banned import(s) in ${dashboardFiles.length} dashboard file(s)`,
        );
        console.log(`💡 Import from '${BANNED_IMPORT}' is not allowed anywhere in the dashboard app`);
    } else {
        console.log(`✅ No banned imports found in ${dashboardFiles.length} dashboard file(s)`);
        console.log(`🎉 All dashboard files are free of banned imports`);
    }

    if (hasBadImports || hasBannedImports) {
        process.exit(1);
    }
}

main();
