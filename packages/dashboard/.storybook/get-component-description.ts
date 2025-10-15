/**
 * Extract and clean description from component source file
 * This reads the TypeScript file directly and extracts the JSDoc description
 */
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

export function getComponentDescription(componentPath: string): string {
    try {
        const fullPath = resolve(dirname(componentPath), componentPath);
        const source = readFileSync(fullPath, 'utf-8');

        // Find JSDoc comment block before export function/const
        const jsdocMatch = source.match(/\/\*\*([\s\S]*?)\*\/[\s\S]*?export\s+(function|const)/);
        if (!jsdocMatch) return '';

        const jsdocContent = jsdocMatch[1];

        // Extract description (text after @description tag)
        const descriptionMatch = jsdocContent.match(
            /@description\s*\n\s*\*\s*([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/)/,
        );
        if (!descriptionMatch) {
            // If no @description tag, get the first paragraph
            const firstParagraphMatch = jsdocContent.match(/^\s*\*\s*([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/)/);
            if (firstParagraphMatch) {
                return cleanDescription(firstParagraphMatch[1]);
            }
            return '';
        }

        return cleanDescription(descriptionMatch[1]);
    } catch (error) {
        console.warn(`Failed to extract description from ${componentPath}:`, error);
        return '';
    }
}

function cleanDescription(text: string): string {
    return text
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '')) // Remove leading *
        .join('\n')
        .trim();
}

// Helper to create story metadata with description
export function withDescription(componentPath: string) {
    return {
        component: {
            description: getComponentDescription(componentPath),
        },
    };
}
