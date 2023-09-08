import { Card, useDetailComponentData } from '@vendure/admin-ui/react';
import React from 'react';

export function CustomDetailComponent(props: any) {
    const { entity, detailForm } = useDetailComponentData();
    const updateName = () => {
        detailForm.get('name')?.setValue('New name');
        detailForm.markAsDirty();
    };
    return (
        <Card title={'Custom Detail Component'}>
            <button className="button" onClick={updateName}>
                Update name
            </button>
            <pre>{JSON.stringify(entity, null, 2)}</pre>
        </Card>
    );
}
