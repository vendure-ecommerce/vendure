import { addDetailQueryDocument } from '@/vdb/framework/form-engine/custom-form-component-extensions.js';
import { parse } from 'graphql';

import { addDisplayComponent } from '../display-component-extensions.js';
import { addInputComponent } from '../input-component-extensions.js';
import { DashboardDetailFormExtensionDefinition } from '../types/detail-forms.js';

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

            // Register input components for this detail form
            if (detailForm.inputs) {
                for (const inputComponent of detailForm.inputs) {
                    addInputComponent({
                        pageId: detailForm.pageId,
                        blockId: inputComponent.blockId,
                        field: inputComponent.field,
                        component: inputComponent.component,
                    });
                }
            }

            // Register display components for this detail form
            if (detailForm.displays) {
                for (const displayComponent of detailForm.displays) {
                    addDisplayComponent({
                        pageId: detailForm.pageId,
                        blockId: displayComponent.blockId,
                        field: displayComponent.field,
                        component: displayComponent.component,
                    });
                }
            }
        }
    }
}
