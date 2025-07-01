#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIB_DIR = path.join(__dirname, '../src/lib');

// Allowlist of @/ imports that are safe to keep
const ALLOWED_IMPORTS = ['@/lib/trans.js', '@/lib/utils.js', '@/components/ui'];

function findHookFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.startsWith('use-') && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

function checkFileForBadImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const badImports = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Check for import statements that start with @/
        if (trimmedLine.startsWith('import') && trimmedLine.includes('@/')) {
            // Check if this import is in the allowlist
            const isAllowed = ALLOWED_IMPORTS.some(allowed => {
                if (allowed.endsWith('/')) {
                    // For directory patterns like '@/components/ui'
                    return trimmedLine.includes(allowed);
                } else {
                    // For exact file matches
                    return trimmedLine.includes(allowed);
                }
            });

            if (!isAllowed) {
                badImports.push({
                    line: i + 1,
                    content: trimmedLine,
                });
            }
        }
    }

    return badImports;
}

function main() {
    console.log('🔍 Checking for @/ imports in hook files (use-*.ts/tsx) in src/lib directory...\n');
    console.log('✅ Allowed imports:');
    ALLOWED_IMPORTS.forEach(allowed => {
        console.log(`   - ${allowed}`);
    });
    console.log('');

    if (!fs.existsSync(LIB_DIR)) {
        console.error('❌ src/lib directory not found!');
        process.exit(1);
    }

    const files = findHookFiles(LIB_DIR);
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
            }
            console.log('');
        }
    }

    if (hasBadImports) {
        console.log(`❌ Found ${totalBadImports} bad import(s) in ${files.length} hook file(s)`);
        console.log('💡 All imports in hook files should use relative paths, except for allowed imports');
        process.exit(1);
    } else {
        console.log(`✅ No bad imports found in ${files.length} hook file(s)`);
        console.log('🎉 All imports in hook files are using relative paths or allowed @/ paths');
    }
}

main();
