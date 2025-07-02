#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're running from the dashboard directory or root directory
const currentDir = process.cwd();
const isDashboardDir = currentDir.endsWith('packages/dashboard');
const HOOKS_DIR = isDashboardDir
    ? path.join(__dirname, '../src/lib/hooks')
    : path.join(currentDir, 'packages/dashboard/src/lib/hooks');

// Required prefix for imports in hook files
const REQUIRED_PREFIX = '@/vdb';

function findHookFiles(dir) {
    const files = [];

    // Since we're now looking directly in the hooks directory,
    // we can just get all .ts and .tsx files that start with 'use-'
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && item.startsWith('use-') && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
            files.push(fullPath);
        }
    }

    return files;
}

function checkFileForBadImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const badImports = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Check for import statements
        if (trimmedLine.startsWith('import')) {
            // Check for relative imports that go up directories (../)
            if (trimmedLine.includes('../')) {
                badImports.push({
                    line: i + 1,
                    content: trimmedLine,
                    reason: 'Relative imports going up directories (../) are not allowed in hook files',
                });
            }

            // Check for @/ imports that don't start with @/vdb
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

function main() {
    console.log(
        '🔍 Checking for import patterns in hook files (use-*.ts/tsx) in src/lib/hooks directory...\n',
    );
    console.log('✅ Requirements:');
    console.log(`   - All imports must start with ${REQUIRED_PREFIX}`);
    console.log('   - Relative imports going up directories (../) are not allowed');
    console.log('   - Relative imports in same directory (./) are allowed');
    console.log('');

    if (!fs.existsSync(HOOKS_DIR)) {
        console.error('❌ src/lib/hooks directory not found!');
        process.exit(1);
    }

    const files = findHookFiles(HOOKS_DIR);
    let hasBadImports = false;
    let totalBadImports = 0;

    for (const file of files) {
        const relativePath = path.relative(process.cwd(), file);
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
        console.log(`❌ Found ${totalBadImports} bad import(s) in ${files.length} hook file(s)`);
        console.log(
            `💡 All imports in hook files must start with ${REQUIRED_PREFIX} and must not use relative paths going up directories`,
        );
        process.exit(1);
    } else {
        console.log(`✅ No bad imports found in ${files.length} hook file(s)`);
        console.log(`🎉 All imports in hook files are using ${REQUIRED_PREFIX} prefix`);
    }
}

main();
