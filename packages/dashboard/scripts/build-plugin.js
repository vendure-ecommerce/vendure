#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

/**
 * Build script for the dashboard plugin
 * Copies package.json from plugin source to dist/plugin output directory
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePackageJson = path.join(__dirname, '../plugin/package.json');
const outputDir = path.join(__dirname, '../dist/plugin');
const outputPackageJson = path.join(outputDir, 'package.json');

try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created output directory: ${outputDir}`);
    }

    // Copy package.json
    if (fs.existsSync(sourcePackageJson)) {
        fs.copyFileSync(sourcePackageJson, outputPackageJson);
        console.log(`Copied package.json from ${sourcePackageJson} to ${outputPackageJson}`);
    } else {
        console.error(`Source package.json not found at: ${sourcePackageJson}`);
        process.exit(1);
    }

    console.log('Plugin build completed successfully');
} catch (error) {
    console.error('Plugin build failed:', error.message);
    process.exit(1);
}