import { FieldInfo } from '@/vdb/framework/document-introspection/get-document-structure.js';

/**
 * Returns the default column visibility configuration.
 *
 * @example
 * ```ts
 * const columnVisibility = getColumnVisibility(fields, {
 *     id: false,
 *     createdAt: false,
 *     updatedAt: false,
 * });
 * ```
 */
export function getColumnVisibility(
    fields: FieldInfo[],
    defaultVisibility?: Record<string, boolean | undefined>,
    customFieldColumnNames?: string[],
): Record<string, boolean> {
    const allDefaultsTrue = defaultVisibility && Object.values(defaultVisibility).every(v => v === true);
    const allDefaultsFalse = defaultVisibility && Object.values(defaultVisibility).every(v => v === false);
    return {
        id: false,
        createdAt: false,
        updatedAt: false,
        ...(allDefaultsTrue ? { ...Object.fromEntries(fields.map(f => [f.name, false])) } : {}),
        ...(allDefaultsFalse ? { ...Object.fromEntries(fields.map(f => [f.name, true])) } : {}),
        // Make custom fields hidden by default unless overridden
        ...(customFieldColumnNames
            ? { ...Object.fromEntries(customFieldColumnNames.map(f => [f, false])) }
            : {}),
        ...defaultVisibility,
    };
}
