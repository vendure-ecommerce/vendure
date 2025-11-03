import { AccessorFnColumnDef } from '@tanstack/react-table';
import { AccessorKeyColumnDef } from '@tanstack/table-core';

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
    columns: Array<AccessorKeyColumnDef<any> | AccessorFnColumnDef<any>>,
    defaultVisibility?: Record<string, boolean | undefined>,
    customFieldColumnNames?: string[],
): Record<string, boolean> {
    const allDefaultsTrue = defaultVisibility && Object.values(defaultVisibility).every(v => v === true);
    const allDefaultsFalse = defaultVisibility && Object.values(defaultVisibility).every(v => v === false);
    return {
        id: false,
        createdAt: false,
        updatedAt: false,
        ...(allDefaultsTrue ? { ...Object.fromEntries(columns.map(f => [f.id, false])) } : {}),
        ...(allDefaultsFalse ? { ...Object.fromEntries(columns.map(f => [f.id, true])) } : {}),
        // Make custom fields hidden by default unless overridden
        ...(customFieldColumnNames
            ? { ...Object.fromEntries(customFieldColumnNames.map(f => [f, false])) }
            : {}),
        ...defaultVisibility,
        selection: true,
        actions: true,
    };
}

/**
 * Ensures that the default column order always starts with `id`, `createdAt`, `deletedAt`
 */
export function getStandardizedDefaultColumnOrder<T extends string | number | symbol>(
    defaultColumnOrder?: T[],
): T[] {
    const standardFirstColumns = new Set(['id', 'createdAt', 'updatedAt']);
    if (!defaultColumnOrder) {
        return [...standardFirstColumns] as T[];
    }
    const rest = defaultColumnOrder.filter(c => !standardFirstColumns.has(c as string));
    return [...standardFirstColumns, ...rest] as T[];
}
