import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';

/**
 * Vite plugin that extracts JSDoc documentation from component files and inlines it into Storybook stories.
 *
 * **Why this exists:**
 * - Our codebase uses custom JSDoc tags (@description, @docsCategory, @docsPage) for documentation generation
 * - TypeScript's JSDoc parser treats @description as a tag, not as description content
 * - Storybook's react-docgen-typescript reads source files directly, bypassing Vite transformations
 * - This plugin runs at build time to extract descriptions from component JSDoc and inline them into story metadata
 * - This avoids duplicating documentation between source files and Storybook stories
 *
 * **How it works:**
 * 1. Finds `withDescription(import.meta.url, './component.js')` calls in story files
 * 2. Reads the component source file from disk at build time
 * 3. Extracts description and @example blocks from JSDoc comments
 * 4. Inlines the extracted content into the story's `parameters.docs.description.component`
 * 5. Removes the `withDescription` import since it's no longer needed
 *
 * **Usage in story files:**
 * ```typescript
 * import { withDescription } from '../../../.storybook/with-description.js';
 *
 * const meta = {
 *   title: 'Form Components/AffixedInput',
 *   component: AffixedInput,
 *   ...withDescription(import.meta.url, './affixed-input.js'),
 * } satisfies Meta<typeof AffixedInput>;
 * ```
 */
export function extractJSDocPlugin() {
    return {
        name: 'extract-jsdoc-description',
        transform(code, id) {
            // Only process .stories.tsx files
            if (!id.endsWith('.stories.tsx')) {
                return null;
            }

            // Look for withDescription calls
            const withDescRegex = /withDescription\(import\.meta\.url,\s*['"]([^'"]+)['"]\)/g;
            let match;
            let transformed = code;

            while ((match = withDescRegex.exec(code)) !== null) {
                const componentPath = match[1];
                const fullMatch = match[0];

                try {
                    // Resolve component path relative to story file
                    const storyDir = dirname(id);
                    const componentFilePath = resolve(storyDir, componentPath.replace('.js', '.tsx'));

                    // Read component source
                    const source = readFileSync(componentFilePath, 'utf-8');

                    // Extract description and examples from JSDoc
                    const description = extractDescription(source, componentPath);

                    if (description) {
                        // Remove the spread and the withDescription call
                        const removePattern = new RegExp(`\\.\\.\\.${fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},?\\s*`, 'g');
                        transformed = transformed.replace(removePattern, '');

                        // Add the description to parameters.docs.description.component
                        const hasParameters = /parameters:\s*\{/.test(transformed);

                        if (hasParameters) {
                            // Add docs.description.component to existing parameters
                            transformed = transformed.replace(
                                /(parameters:\s*\{)/,
                                `$1\n        docs: { description: { component: ${JSON.stringify(description)} } },`
                            );
                        } else {
                            // Add new parameters object
                            transformed = transformed.replace(
                                /(}\s*satisfies\s+Meta)/,
                                `,\n    parameters: {\n        docs: { description: { component: ${JSON.stringify(description)} } }\n    }$1`
                            );
                        }
                    }
                } catch (error) {
                    console.error(`Failed to extract description for ${componentPath}:`, error);
                }
            }

            if (transformed !== code) {
                // Remove the withDescription import since we've inlined everything
                transformed = transformed.replace(
                    /import\s+\{\s*withDescription\s*\}\s+from\s+['"][^'"]+with-description\.js['"];?\s*\n?/,
                    '',
                );

                return {
                    code: transformed,
                    map: null,
                };
            }

            return null;
        },
    };
}

function extractDescription(source, componentPath) {
    // Get the base filename without path and extension
    // e.g., './datetime-input.js' -> 'datetime-input'
    const fileName = componentPath.replace(/^\.\//, '').replace(/\.js$/, '');

    console.log(`[extractJSDocPlugin] Looking for component matching file: ${fileName}`);

    // Find all JSDoc blocks with their associated exports
    // This regex captures the JSDoc content and the export statement that follows
    const allExportsPattern = /\/\*\*([\s\S]*?)\*\/\s*export\s+(?:function|const)\s+(\w+)/g;
    const matches = [...source.matchAll(allExportsPattern)];

    console.log(`[extractJSDocPlugin] Found ${matches.length} exports with JSDoc: ${matches.map(m => m[2]).join(', ')}`);

    if (matches.length === 0) {
        return null;
    }

    // Strategy: Find the export whose name, when converted to kebab-case, matches the filename
    // e.g., DateTimeInput -> datetime-input
    const componentMatch = matches.find(match => {
        const exportName = match[2];
        // Convert PascalCase to kebab-case
        const kebabCase = exportName
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();
        return kebabCase === fileName;
    });

    if (!componentMatch) {
        console.warn(
            `[extractJSDocPlugin] Could not find component matching ${fileName}, using last export: ${matches[matches.length - 1][2]}`
        );
        // Use the LAST export (most likely to be the main component)
        return extractJSDocContent(matches[matches.length - 1][1]);
    }

    console.log(`[extractJSDocPlugin] Found JSDoc for ${componentMatch[2]}`);
    const jsdocContent = componentMatch[1];
    return extractJSDocContent(jsdocContent);
}

function extractJSDocContent(jsdocContent) {

    // Extract description (text after @description tag, before next tag or end)
    const descriptionMatch = jsdocContent.match(/@description\s*\n\s*\*\s*([\s\S]*?)(?=\n\s*\*\s*@|\n\s*$)/);

    let description = '';
    if (descriptionMatch) {
        // Found @description tag, extract the text after it
        description = descriptionMatch[1]
            .split('\n')
            .map(line => line.replace(/^\s*\*\s?/, '').trim())
            .join(' ')
            .trim();
    } else {
        // No @description tag, try to get first paragraph
        const firstParagraphMatch = jsdocContent.match(/^\s*\*\s*([\s\S]*?)(?=\n\s*\*\s*@|\n\s*$)/);
        if (firstParagraphMatch) {
            description = firstParagraphMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*\*\s?/, '').trim())
                .filter(line => line.length > 0)
                .join(' ')
                .trim();
        }
    }

    // Extract @example blocks
    const exampleMatches = jsdocContent.matchAll(/@example\s*\n([\s\S]*?)(?=\n\s*\*\s*@|$)/g);
    const examples = [];

    for (const match of exampleMatches) {
        const exampleContent = match[1]
            .split('\n')
            .map(line => line.replace(/^\s*\*\s?/, ''))
            .join('\n')
            .trim();

        if (exampleContent) {
            examples.push(exampleContent);
        }
    }

    // Combine description and examples into a single markdown string
    let result = description;

    if (examples.length > 0) {
        if (result) {
            result += '\n\n';
        }
        result += examples.join('\n\n');
    }

    return result || null;
}
