import { useAllBulkActions } from '@/vdb/components/data-table/use-all-bulk-actions.js';
import { DisplayComponent } from '@/vdb/framework/component-registry/display-component.js';
import {
    FieldInfo,
    getOperationVariablesFields,
    getTypeFieldInfo,
} from '@/vdb/framework/document-introspection/get-document-structure.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useMutation } from '@tanstack/react-query';
import { AccessorKeyColumnDef, createColumnHelper, Row } from '@tanstack/react-table';
import { EllipsisIcon, TrashIcon } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import {
    AdditionalColumns,
    AllItemFieldKeys,
    CustomizeColumnConfig,
    FacetedFilterConfig,
    PaginatedListItemFields,
    RowAction,
    usePaginatedList,
} from '../shared/paginated-list-data-table.js';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog.js';
import { Button } from '../ui/button.js';
import { Checkbox } from '../ui/checkbox.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu.js';
import { DataTableColumnHeader } from './data-table-column-header.js';

/**
 * @description
 * This hook is used to generate the columns for a data table, combining the fields
 * from the query with the additional columns and the custom fields.
 *
 * It also
 * - adds the row actions and the delete mutation.
 * - adds the row selection column.
 * - adds the custom field columns.
 */
export function useGeneratedColumns<T extends TypedDocumentNode<any, any>>({
    fields,
    customizeColumns,
    rowActions,
    bulkActions,
    deleteMutation,
    additionalColumns,
    defaultColumnOrder,
    facetedFilters,
    includeSelectionColumn = true,
    includeActionsColumn = true,
    enableSorting = true,
}: Readonly<{
    fields: FieldInfo[];
    customizeColumns?: CustomizeColumnConfig<T>;
    rowActions?: RowAction<PaginatedListItemFields<T>>[];
    bulkActions?: BulkAction[];
    deleteMutation?: TypedDocumentNode<any, any>;
    additionalColumns?: AdditionalColumns<T>;
    defaultColumnOrder?: Array<string | number | symbol>;
    facetedFilters?: FacetedFilterConfig<T>;
    includeSelectionColumn?: boolean;
    includeActionsColumn?: boolean;
    enableSorting?: boolean;
}>) {
    const columnHelper = createColumnHelper<PaginatedListItemFields<T>>();
    const allBulkActions = useAllBulkActions(bulkActions ?? []);

    const { columns, customFieldColumnNames } = useMemo(() => {
        const columnConfigs: Array<{ fieldInfo: FieldInfo; isCustomField: boolean }> = [];
        const customFieldColumnNames: string[] = [];

        columnConfigs.push(
            ...fields // Filter out custom fields
                .filter(field => field.name !== 'customFields' && !field.type.endsWith('CustomFields'))
                .map(field => ({ fieldInfo: field, isCustomField: false })),
        );

        const customFieldColumn = fields.find(field => field.name === 'customFields');
        if (customFieldColumn && customFieldColumn.type !== 'JSON') {
            const customFieldFields = getTypeFieldInfo(customFieldColumn.type);
            columnConfigs.push(
                ...customFieldFields.map(field => ({ fieldInfo: field, isCustomField: true })),
            );
            customFieldColumnNames.push(...customFieldFields.map(field => field.name));
        }

        const queryBasedColumns = columnConfigs.map(({ fieldInfo, isCustomField }) => {
            const customConfig = customizeColumns?.[fieldInfo.name as unknown as AllItemFieldKeys<T>] ?? {};
            const { header, ...customConfigRest } = customConfig;
            const enableColumnFilter = fieldInfo.isScalar && !facetedFilters?.[fieldInfo.name];

            return columnHelper.accessor(fieldInfo.name as any, {
                id: fieldInfo.name,
                meta: { fieldInfo, isCustomField },
                enableColumnFilter,
                enableSorting: fieldInfo.isScalar && enableSorting,
                // Filtering is done on the server side, but we set this to 'equalsString' because
                // otherwise the TanStack Table with apply an "auto" function which somehow
                // prevents certain filters from working.
                filterFn: 'equalsString',
                cell: ({ cell, row }) => {
                    const cellValue = cell.getValue();
                    const value =
                        cellValue ??
                        (isCustomField ? row.original?.customFields?.[fieldInfo.name] : undefined);

                    if (fieldInfo.list && Array.isArray(value)) {
                        return value.join(', ');
                    }
                    if (
                        (fieldInfo.type === 'DateTime' && typeof value === 'string') ||
                        value instanceof Date
                    ) {
                        return <DisplayComponent id="vendure:dateTime" value={value} />;
                    }
                    if (fieldInfo.type === 'Boolean') {
                        if (cell.column.id === 'enabled') {
                            return <DisplayComponent id="vendure:booleanBadge" value={value} />;
                        } else {
                            return <DisplayComponent id="vendure:booleanCheckbox" value={value} />;
                        }
                    }
                    if (fieldInfo.type === 'Asset') {
                        return <DisplayComponent id="vendure:asset" value={value} />;
                    }
                    if (value !== null && typeof value === 'object') {
                        return JSON.stringify(value);
                    }
                    return value;
                },
                header: headerContext => {
                    return (
                        <DataTableColumnHeader headerContext={headerContext} customConfig={customConfig} />
                    );
                },
                ...customConfigRest,
            });
        });

        let finalColumns = [...queryBasedColumns];

        for (const [id, column] of Object.entries(additionalColumns ?? {})) {
            if (!id) {
                throw new Error('Column id is required');
            }
            finalColumns.push(columnHelper.accessor(id as any, { ...column, id }));
        }

        if (defaultColumnOrder) {
            // ensure the columns with ids matching the items in defaultColumnOrder
            // appear as the first columns in sequence, and leave the remainder in the
            // existing order
            const orderedColumns = finalColumns
                .filter(column => column.id && defaultColumnOrder.includes(column.id as any))
                .sort(
                    (a, b) =>
                        defaultColumnOrder.indexOf(a.id as any) - defaultColumnOrder.indexOf(b.id as any),
                );
            const remainingColumns = finalColumns.filter(
                column => !column.id || !defaultColumnOrder.includes(column.id as any),
            );
            finalColumns = [...orderedColumns, ...remainingColumns];
        }

        if (includeActionsColumn && (rowActions || deleteMutation || bulkActions)) {
            const rowActionColumn = getRowActions(rowActions, deleteMutation, allBulkActions);
            if (rowActionColumn) {
                finalColumns.push(rowActionColumn);
            }
        }

        if (includeSelectionColumn) {
            // Add the row selection column
            finalColumns.unshift({
                id: 'selection',
                accessorKey: 'selection',
                header: ({ table }) => (
                    <Checkbox
                        className="mx-1"
                        checked={table.getIsAllRowsSelected()}
                        onCheckedChange={checked =>
                            table.toggleAllRowsSelected(checked === 'indeterminate' ? undefined : checked)
                        }
                    />
                ),
                enableColumnFilter: false,
                cell: ({ row }) => {
                    return (
                        <Checkbox
                            className="mx-1"
                            checked={row.getIsSelected()}
                            onCheckedChange={row.getToggleSelectedHandler()}
                        />
                    );
                },
            });
        }

        return { columns: finalColumns, customFieldColumnNames };
    }, [fields, customizeColumns, rowActions, deleteMutation, additionalColumns, defaultColumnOrder]);

    return { columns, customFieldColumnNames };
}

function getRowActions(
    rowActions?: RowAction<any>[],
    deleteMutation?: TypedDocumentNode<any, any>,
    bulkActions?: BulkAction[],
): AccessorKeyColumnDef<any> | undefined {
    return {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <Trans>Actions</Trans>,
        enableColumnFilter: false,
        cell: ({ row, table }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <EllipsisIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {rowActions?.map((action, index) => (
                            <DropdownMenuItem
                                onClick={() => action.onClick?.(row)}
                                key={`${action.label}-${index}`}
                            >
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                        {bulkActions?.map((action, index) => (
                            <action.component key={`bulk-action-${index}`} selection={[row]} table={table} />
                        ))}
                        {deleteMutation && (
                            <DeleteMutationRowAction deleteMutation={deleteMutation} row={row} />
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };
}

function DeleteMutationRowAction({
    deleteMutation,
    row,
}: Readonly<{
    deleteMutation: TypedDocumentNode<any, any>;
    row: Row<{ id: string }>;
}>) {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();

    // Inspect the mutation variables to determine if it expects 'id' or 'ids'
    const mutationVariables = getOperationVariablesFields(deleteMutation);
    const hasIdsParameter = mutationVariables.some(field => field.name === 'ids');

    const { mutate: deleteMutationFn } = useMutation({
        mutationFn: api.mutate(deleteMutation),
        onSuccess: (result: {
            [key: string]:
                | { result: 'DELETED' | 'NOT_DELETED'; message: string }
                | {
                      result: 'DELETED' | 'NOT_DELETED';
                      message: string;
                  }[];
        }) => {
            const unwrappedResult = Object.values(result)[0];
            // Handle both single result and array of results
            const resultToCheck = Array.isArray(unwrappedResult) ? unwrappedResult[0] : unwrappedResult;
            if (resultToCheck.result === 'DELETED') {
                refetchPaginatedList();
                toast.success(i18n.t('Deleted successfully'));
            } else {
                toast.error(i18n.t('Failed to delete'), {
                    description: resultToCheck.message,
                });
            }
        },
        onError: (err: Error) => {
            toast.error(i18n.t('Failed to delete'), {
                description: err.message,
            });
        },
    });
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <div className="flex items-center gap-2 text-destructive">
                        <TrashIcon className="w-4 h-4 text-destructive" />
                        <Trans>Delete</Trans>
                    </div>
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <Trans>Confirm deletion</Trans>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <Trans>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </Trans>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        <Trans>Cancel</Trans>
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            // Pass variables based on what the mutation expects
                            if (hasIdsParameter) {
                                deleteMutationFn({ ids: [row.original.id] });
                            } else {
                                // Fallback to single id if we can't determine the format
                                deleteMutationFn({ id: row.original.id });
                            }
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        <Trans>Delete</Trans>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
