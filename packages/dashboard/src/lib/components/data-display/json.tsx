import { JsonEditor } from 'json-edit-react';

export function Json({ value }: Readonly<{ value: any }>) {
    return <JsonEditor data={value} />;
}
