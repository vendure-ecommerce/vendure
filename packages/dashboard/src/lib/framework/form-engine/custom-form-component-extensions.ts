import { DocumentNode } from 'graphql';

import { DashboardCustomFormComponent } from '../extension-api/types/form-components.js';
import { globalRegistry } from '../registry/global-registry.js';

import { CustomFormComponentInputProps } from './custom-form-component.js';

globalRegistry.register(
    'customFormComponents',
    new Map<string, React.FunctionComponent<CustomFormComponentInputProps>>(),
);

globalRegistry.register('detailQueryDocumentRegistry', new Map<string, DocumentNode[]>());

export function getCustomFormComponent(
    id: string,
): React.FunctionComponent<CustomFormComponentInputProps> | undefined {
    return globalRegistry.get('customFormComponents').get(id);
}

export function addCustomFormComponent({ id, component }: DashboardCustomFormComponent) {
    const customFormComponents = globalRegistry.get('customFormComponents');
    if (customFormComponents.has(id)) {
        // eslint-disable-next-line no-console
        console.warn(`Custom form component with id "${id}" is already registered and will be overwritten.`);
    }
    customFormComponents.set(id, component);
}

export function getDetailQueryDocuments(pageId: string): DocumentNode[] {
    return globalRegistry.get('detailQueryDocumentRegistry').get(pageId) || [];
}

export function addDetailQueryDocument(pageId: string, document: DocumentNode) {
    const listQueryDocumentRegistry = globalRegistry.get('detailQueryDocumentRegistry');
    const existingDocuments = listQueryDocumentRegistry.get(pageId) || [];
    listQueryDocumentRegistry.set(pageId, [...existingDocuments, document]);
}
