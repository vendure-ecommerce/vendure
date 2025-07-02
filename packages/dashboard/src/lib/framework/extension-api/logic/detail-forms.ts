import { addDetailQueryDocument } from '@/framework/form-engine/custom-form-component-extensions.js';
import { parse } from 'graphql';

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
        }
    }
}
