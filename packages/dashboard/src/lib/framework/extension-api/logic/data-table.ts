import { parse } from 'graphql';

import { addBulkAction, addListQueryDocument } from '../../data-table/data-table-extensions.js';
import { addDetailQueryDocument } from '../../form-engine/custom-form-component-extensions.js';
import { addDisplayComponent } from '../display-component-extensions.js';
import {
    DashboardDataTableExtensionDefinition,
    DashboardDetailFormExtensionDefinition,
} from '../types/index.js';

/**
 * @description
 * Generates a data table display component key based on the pageId and column name.
 * Uses the pattern: pageId_columnName
 */
export function generateDataTableDisplayComponentKey(pageId: string, column: string): string {
    return `${pageId}_${column}`;
}

/**
 * @description
 * Adds a display component for a specific column in a data table.
 */
export function addDataTableDisplayComponent(
    pageId: string,
    column: string,
    component: React.ComponentType<{ value: any; [key: string]: any }>,
) {
    const key = generateDataTableDisplayComponentKey(pageId, column);
    addDisplayComponent({ pageId, blockId: 'list-table', field: column, component });
}

export function registerDataTableExtensions(dataTables?: DashboardDataTableExtensionDefinition[]) {
    if (dataTables) {
        for (const dataTable of dataTables) {
            if (dataTable.bulkActions?.length) {
                for (const action of dataTable.bulkActions) {
                    addBulkAction(dataTable.pageId, dataTable.blockId, action);
                }
            }
            if (dataTable.extendListDocument) {
                const document =
                    typeof dataTable.extendListDocument === 'function'
                        ? dataTable.extendListDocument()
                        : dataTable.extendListDocument;

                addListQueryDocument(
                    dataTable.pageId,
                    dataTable.blockId,
                    typeof document === 'string' ? parse(document) : document,
                );
            }
            if (dataTable.displayComponents?.length) {
                for (const displayComponent of dataTable.displayComponents) {
                    addDataTableDisplayComponent(
                        dataTable.pageId,
                        displayComponent.column,
                        displayComponent.component,
                    );
                }
            }
        }
    }
}

export function registerDetailFormExtensions(detailForms?: DashboardDetailFormExtensionDefinition[]) {
    if (detailForms) {
        for (const detailForm of detailForms) {
            if (detailForm.extendDetailDocument) {
                const document =
                    typeof detailForm.extendDetailDocument === 'function'
                        ? detailForm.extendDetailDocument()
                        : detailForm.extendDetailDocument;

                addDetailQueryDocument(
                    detailForm.pageId,
                    typeof document === 'string' ? parse(document) : document,
                );
            }
        }
    }
}
