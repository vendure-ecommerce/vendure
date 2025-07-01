import { parse } from 'graphql';

import { addBulkAction, addListQueryDocument } from '../../data-table/data-table-extensions.js';
import { addDetailQueryDocument } from '../../form-engine/custom-form-component-extensions.js';
import {
    DashboardDataTableExtensionDefinition,
    DashboardDetailFormExtensionDefinition,
} from '../types/index.js';

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
