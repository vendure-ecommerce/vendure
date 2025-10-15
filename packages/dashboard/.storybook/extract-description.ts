/**
 * Extract clean description from a component's JSDoc
 * This reads the raw TypeScript source file and extracts the description
 */
export function extractDescription(component: any): string | undefined {
    const docgenInfo = component?.__docgenInfo;
    if (!docgenInfo) return undefined;

    // If there's already a description, clean it
    if (docgenInfo.description) {
        return cleanJSDocDescription(docgenInfo.description);
    }

    return undefined;
}

/**
 * Clean JSDoc tags from a description string
 */
function cleanJSDocDescription(description: string): string {
    if (!description) return description;

    return description
        .replace(/@description\s*/gi, '')
        .replace(/@example\s*/gi, 'Example:\n')
        .replace(/@docsCategory\s+[\w-]+/gi, '')
        .replace(/@docsPage\s+[\w-]+/gi, '')
        .replace(/\n\n\n+/g, '\n\n')
        .trim();
}
