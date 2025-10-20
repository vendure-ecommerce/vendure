import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// eslint-disable no-console

/**
 * Extracts the first heading (# or ##) from markdown content
 */
function extractTitle(content: string): string {
    const titleRegex = /^##?\s+(.+)$/m;
    const match = content.match(titleRegex);
    return match ? match[1].trim() : '';
}

/**
 * Extracts the Instructions section from SKILL.md
 */
function extractInstructions(content: string): string {
    const instructionsRegex = /## Instructions\s+([\s\S]*?)(?=\n##|$)/;
    const match = content.match(instructionsRegex);
    return match ? match[1].trim() : '';
}

/**
 * Replaces file references with section references
 */
function replaceFileReferences(text: string, fileToTitleMap: Map<string, string>): string {
    let result = text;

    // Replace patterns like ./01-general.md or ./filename.md
    for (const [filename, title] of fileToTitleMap.entries()) {
        const patterns = [new RegExp(`\\./${filename}`, 'g'), new RegExp(`\\b${filename}\\b`, 'g')];

        patterns.forEach(pattern => {
            result = result.replace(pattern, `the "${title}" section below`);
        });
    }

    return result;
}

/**
 * Counts the number of lines in text
 */
function countLines(text: string): number {
    return text.split('\n').length;
}

/**
 * Generates a migration prompt by concatenating all markdown files from the
 * vendure-dashboard-migration skill directory and inserting it into the
 * migration index.md documentation file.
 */
function generateMigrationPrompt() {
    const skillsDir = join(__dirname, '../../.claude/skills/vendure-dashboard-migration');
    const docsFile = join(__dirname, '../docs/guides/extending-the-dashboard/migration/index.md');

    // Read the SKILL.md to extract instructions
    const skillContent = readFileSync(join(skillsDir, 'SKILL.md'), 'utf-8');
    const instructions = extractInstructions(skillContent);

    // Files to concatenate in order
    const files = [
        '01-general.md',
        '01a-common-tasks.md',
        '01b-tsconfig-setup.md',
        '02-forms.md',
        '03-custom-field-inputs.md',
        '04-list-pages.md',
        '05-detail-pages.md',
        '06-adding-nav-menu-items.md',
        '07-action-bar-items.md',
        '08-custom-detail-components.md',
        '09-page-tabs.md',
        '10-widgets.md',
    ];

    // Build a map of filenames to their section titles
    const fileToTitleMap = new Map<string, string>();
    const fileLineCounts: { file: string; lines: number }[] = [];
    let totalInputLines = 0;

    for (const file of files) {
        const filePath = join(skillsDir, file);
        try {
            const content = readFileSync(filePath, 'utf-8');
            const title = extractTitle(content);
            if (title) {
                fileToTitleMap.set(file, title);
            }
        } catch (error) {
            console.error(`Warning: Could not read ${file}:`, error);
        }
    }

    // Start with instructions if found, and replace file references
    const sections: string[] = [];
    let instructionsLines = 0;
    if (instructions) {
        const updatedInstructions = replaceFileReferences(instructions, fileToTitleMap);
        sections.push('## Instructions\n\n' + updatedInstructions);
        instructionsLines = countLines(updatedInstructions);
        totalInputLines += instructionsLines;
    }

    // Read and add all content files
    for (const file of files) {
        const filePath = join(skillsDir, file);
        try {
            const content = readFileSync(filePath, 'utf-8');
            const lineCount = countLines(content);
            fileLineCounts.push({ file, lines: lineCount });
            totalInputLines += lineCount;
            sections.push(content.trim());
        } catch (error) {
            console.error(`Warning: Could not read ${file}:`, error);
        }
    }

    // Join sections with double newline
    const prompt = sections.join('\n\n');
    const outputLines = countLines(prompt);

    // Read the current index.md
    const indexContent = readFileSync(docsFile, 'utf-8');

    // Find the code block after the HTML comment marker
    // Use greedy match to capture all content until the LAST closing backticks
    // This is important because the content itself contains code blocks with backticks
    const promptSectionRegex = /(<!-- Note: the following code block[\s\S]*?-->\n)(````md\n)([\s\S]*)(````)/;

    const match = indexContent.match(promptSectionRegex);
    if (!match) {
        throw new Error('Could not find the HTML comment marker and code block in index.md');
    }

    // Replace the content inside the code block, preserving the backtick style
    const updatedContent = indexContent.replace(promptSectionRegex, `$1$2${prompt}\n$4`);

    // Write back to the file
    writeFileSync(docsFile, updatedContent, 'utf-8');

    // Print success message and statistics
    console.log('✓ Migration prompt successfully generated and inserted into index.md');
    console.log(`\n📊 Line Count Report:`);
    console.log(`   ─────────────────────────────────────────────────────`);

    if (instructionsLines > 0) {
        console.log(`   Instructions (SKILL.md):        ${instructionsLines.toString().padStart(6)} lines`);
    }

    fileLineCounts.forEach(({ file, lines }) => {
        console.log(`   ${file.padEnd(30)} ${lines.toString().padStart(6)} lines`);
    });

    console.log(`   ─────────────────────────────────────────────────────`);
    console.log(`   Total input lines:              ${totalInputLines.toString().padStart(6)} lines`);
    console.log(`   Output lines (concatenated):    ${outputLines.toString().padStart(6)} lines`);

    // Calculate the difference (should account for section separators)
    const separatorLines = sections.length - 1; // Number of "\n\n" separators
    const expectedOutputLines = totalInputLines + separatorLines;
    const lineDifference = outputLines - expectedOutputLines;

    console.log(
        `   Expected (with ${separatorLines} separators):   ${expectedOutputLines.toString().padStart(6)} lines`,
    );
    console.log(
        `   Difference:                     ${lineDifference >= 0 ? '+' : ''}${lineDifference} lines`,
    );
    console.log(`\n   Total files concatenated: ${files.length}`);
    console.log(`   Total characters: ${prompt.length.toLocaleString()}`);
}

// Run the script
generateMigrationPrompt();
