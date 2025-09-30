#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_LOCALES_DIR = '../../src/i18n/locales';

/**
 * Get all supported languages by scanning .po files in the locales directory
 */
function getSupportedLanguages(localesDir) {
    const files = fs.readdirSync(localesDir);
    return files
        .filter(file => file.endsWith('.po'))
        .map(file => file.slice(0, -3)) // Remove .po extension
        .filter(lang => lang !== 'en') // Skip English (source language)
        .sort();
}

/**
 * Parse a .po file and extract missing translations (empty msgstr entries)
 */
function parsePOFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const missingMsgids = [];

    // Split into entries using double newline as separator
    const entries = content.split(/\n\s*\n/);

    for (const entry of entries) {
        const lines = entry.trim().split('\n');
        if (!lines.length) continue;

        const msgidLines = [];
        const msgstrLines = [];
        let currentSection = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('#')) {
                continue;
            } else if (trimmedLine.startsWith('msgid ')) {
                currentSection = 'msgid';
                msgidLines.push(trimmedLine.slice(6)); // Remove 'msgid '
            } else if (trimmedLine.startsWith('msgstr ')) {
                currentSection = 'msgstr';
                msgstrLines.push(trimmedLine.slice(7)); // Remove 'msgstr '
            } else if (trimmedLine.startsWith('"') && currentSection) {
                if (currentSection === 'msgid') {
                    msgidLines.push(trimmedLine);
                } else if (currentSection === 'msgstr') {
                    msgstrLines.push(trimmedLine);
                }
            }
        }

        // Check if we have a msgid and empty msgstr
        if (msgidLines.length && msgstrLines.length) {
            const msgstrContent = msgstrLines.join('');
            if (msgstrContent === '""' || msgstrContent === '') {
                // Extract msgid content
                const msgidContent = msgidLines.join('');
                if (msgidContent.startsWith('"') && msgidContent.endsWith('"')) {
                    const msgidText = msgidContent.slice(1, -1); // Remove outer quotes
                    // Unescape common escape sequences
                    const unescapedText = msgidText
                        .replace(/\\"/g, '"')
                        .replace(/\\n/g, '\n')
                        .replace(/\\\\/g, '\\');

                    if (unescapedText) {
                        // Skip empty msgid (header)
                        missingMsgids.push(unescapedText);
                    }
                }
            }
        }
    }

    return missingMsgids;
}

/**
 * Extract missing translations from all locale files and generate LLM prompt
 */
function extractMissingTranslations(
    localesDir = DEFAULT_LOCALES_DIR,
    outputFile = 'missing-translations.txt',
) {
    const localesPath = path.resolve(__dirname, localesDir);

    if (!fs.existsSync(localesPath)) {
        console.error(`Locales directory not found: ${localesPath}`);
        process.exit(1);
    }

    console.log(`Extracting missing translations from: ${localesPath}`);

    const missingByLanguage = {};
    let totalMissing = 0;

    // Get all supported languages from the directory
    const supportedLanguages = getSupportedLanguages(localesPath);
    console.log(`Found ${supportedLanguages.length} language files: ${supportedLanguages.join(', ')}`);

    // Process each supported language
    for (const lang of supportedLanguages) {
        const poFilePath = path.join(localesPath, `${lang}.po`);

        if (!fs.existsSync(poFilePath)) {
            console.warn(`Warning: .po file not found for ${lang}`);
            continue;
        }

        const missingMsgids = parsePOFile(poFilePath);
        if (missingMsgids.length > 0) {
            missingByLanguage[lang] = missingMsgids;
            totalMissing += missingMsgids.length;
            console.log(`${lang}: ${missingMsgids.length} missing translations`);
        } else {
            console.log(`${lang}: 0 missing translations`);
        }
    }

    // Generate LLM prompt with missing translations
    const promptLines = [
        '# Translation Request for Vendure Dashboard',
        '',
        'Please translate the missing message IDs below for each language. The context is a dashboard for an e-commerce platform called Vendure.',
        '',
        '## Instructions:',
        '1. Translate each msgid into the target language',
        '2. Maintain the original formatting, including placeholders like {0}, {buttonText}, etc.',
        '3. Keep HTML tags and markdown formatting intact',
        '4. Use appropriate UI/technical terminology for each language',
        '5. Return translations in the exact format: language_code followed by msgid|msgstr pairs',
        '6. These strings are for use in the Lingui library and use ICU MessageFormat',
        '7. Always assume e-commerce context unless clearly indicated otherwise',
        '',
        '## Expected Output Format:',
        '```',
        'language_code',
        'msgid_text|translated_text',
        'msgid_text|translated_text',
        '---',
        'language_code',
        'msgid_text|translated_text',
        '---',
        '```',
        '',
        '## Missing Translations:',
        '',
    ];

    // Add missing translations for each language
    for (const [lang, msgids] of Object.entries(missingByLanguage)) {
        promptLines.push(lang);
        for (const msgid of msgids) {
            promptLines.push(msgid);
        }
        promptLines.push('---');
    }

    // Write to output file
    const outputPath = path.resolve(outputFile);
    fs.writeFileSync(outputPath, promptLines.join('\n'), 'utf-8');

    console.log(`\nExtraction completed!`);
    console.log(`Total missing translations: ${totalMissing}`);
    console.log(`Languages with missing translations: ${Object.keys(missingByLanguage).length}`);
    console.log(`Prompt written to: ${outputPath}`);
    console.log(`\nNext steps:`);
    console.log(`1. Copy the content of ${outputFile} to Claude or another LLM`);
    console.log(`2. Save the translated output to a file (e.g., translations.txt)`);
    console.log(`3. Run: node i18n-tool.js apply <translations-file>`);
}

/**
 * Apply translations from LLM output back to .po files
 */
function applyTranslations(translationsFile, localesDir = DEFAULT_LOCALES_DIR) {
    const localesPath = path.resolve(__dirname, localesDir);
    const translationsPath = path.resolve(translationsFile);

    if (!fs.existsSync(localesPath)) {
        console.error(`Locales directory not found: ${localesPath}`);
        process.exit(1);
    }

    if (!fs.existsSync(translationsPath)) {
        console.error(`Translations file not found: ${translationsPath}`);
        process.exit(1);
    }

    console.log(`Applying translations from: ${translationsPath}`);
    console.log(`Target directory: ${localesPath}\n`);

    // Read and parse the translations file
    const translationsContent = fs.readFileSync(translationsPath, 'utf-8');
    const languageBlocks = translationsContent.split(/\n---\n?/).filter(block => block.trim());

    // Parse translations by language
    const translationsByLanguage = {};

    languageBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const languageCode = lines[0].trim();

        if (!languageCode) return;

        translationsByLanguage[languageCode] = {};

        // Parse each translation line (format: msgid|msgstr)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const pipeIndex = line.indexOf('|');

            if (pipeIndex === -1) {
                console.warn(`Warning: Line "${line.substring(0, 50)}..." has no pipe separator, skipping`);
                continue;
            }

            const msgid = line.substring(0, pipeIndex);
            const msgstr = line.substring(pipeIndex + 1);

            translationsByLanguage[languageCode][msgid] = msgstr;
        }
    });

    // Apply translations to each language file
    Object.entries(translationsByLanguage).forEach(([languageCode, translations]) => {
        const translationCount = Object.keys(translations).length;
        console.log(`\nProcessing ${languageCode} (${translationCount} translations)...`);
        updatePoFile(localesPath, languageCode, translations);
    });

    console.log('\nDone!');
}

/**
 * Function to escape special characters in strings for .po files
 */
function escapePoString(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
}

/**
 * Function to escape string for use in regex (including already-escaped quotes)
 */
function escapeRegex(str) {
    // First escape for .po format
    const poEscaped = escapePoString(str);
    // Then escape for regex (note: backslashes are already doubled from escapePoString)
    return poEscaped.replace(/[.*+?^${}()|[\]]/g, '\\$&');
}

/**
 * Function to find and update msgstr in .po file
 */
function updatePoFile(localesDir, languageCode, translations) {
    const poFilePath = path.join(localesDir, `${languageCode}.po`);

    if (!fs.existsSync(poFilePath)) {
        console.warn(`Warning: .po file not found for language ${languageCode}: ${poFilePath}`);
        return;
    }

    let poContent = fs.readFileSync(poFilePath, 'utf-8');
    let updated = 0;
    let notFound = [];

    // Process each translation
    Object.entries(translations).forEach(([msgid, msgstr]) => {
        // Escape the msgid for regex matching
        const escapedMsgidForRegex = escapeRegex(msgid);

        // Pattern to match msgid with empty msgstr
        const pattern = new RegExp(`(msgid "${escapedMsgidForRegex}"\\s*\\n)(msgstr "")`, 'gm');

        const matches = poContent.match(pattern);

        if (matches) {
            poContent = poContent.replace(pattern, `$1msgstr "${escapePoString(msgstr)}"`);
            updated++;
        } else {
            notFound.push(msgid);
        }
    });

    // Write updated content back to file
    if (updated > 0) {
        fs.writeFileSync(poFilePath, poContent, 'utf-8');
        console.log(`✓ ${languageCode}: Updated ${updated} translations`);
    } else {
        console.log(`- ${languageCode}: No translations updated`);
    }

    if (notFound.length > 0) {
        console.log(`  ⚠ ${notFound.length} msgids not found in .po file`);
        if (notFound.length <= 5) {
            notFound.forEach(msg => console.log(`    - "${msg}"`));
        }
    }
}

/**
 * Main CLI interface
 */
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'extract':
            const outputFile = args[1] || 'missing-translations.txt';
            const localesDir = args[2] || DEFAULT_LOCALES_DIR;
            extractMissingTranslations(localesDir, outputFile);
            break;

        case 'apply':
            if (args.length < 2) {
                console.error('Usage: node i18n-tool.js apply <translations-file> [locales-dir]');
                console.error('Example: node i18n-tool.js apply translations.txt');
                process.exit(1);
            }
            const translationsFile = args[1];
            const targetLocalesDir = args[2] || DEFAULT_LOCALES_DIR;
            applyTranslations(translationsFile, targetLocalesDir);
            break;

        default:
            console.log('Vendure Dashboard i18n Tool');
            console.log('');
            console.log('Usage:');
            console.log('  node i18n-tool.js extract [output-file] [locales-dir]');
            console.log('    Extract missing translations and generate LLM prompt');
            console.log('');
            console.log('  node i18n-tool.js apply <translations-file> [locales-dir]');
            console.log('    Apply translated strings back to .po files');
            console.log('');
            console.log('Examples:');
            console.log('  node i18n-tool.js extract');
            console.log('  node i18n-tool.js extract prompt.txt');
            console.log('  node i18n-tool.js apply translations.txt');
            console.log('');
            console.log('Workflow:');
            console.log('  1. Add new messages to dashboard components');
            console.log('  2. Run: lingui extract');
            console.log('  3. Run: node i18n-tool.js extract');
            console.log('  4. Copy prompt to LLM (Claude, etc.) and get translations');
            console.log('  5. Save LLM output to a file');
            console.log('  6. Run: node i18n-tool.js apply <translations-file>');
            break;
    }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export {
    applyTranslations,
    escapePoString,
    escapeRegex,
    extractMissingTranslations,
    parsePOFile,
    updatePoFile,
};
