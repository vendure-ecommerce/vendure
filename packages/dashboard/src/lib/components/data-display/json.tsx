import { JsonEditor } from 'json-edit-react';

export function Json({ value }: { value: any }) {
    return <JsonEditor data={value} />;
}
