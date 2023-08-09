import React from 'react';

export default function Playground(props: {
    document: string;
    api: 'shop' | 'admin';
    server: 'readonlydemo' | 'demo';
}) {
    const urlEncoded = encodeURIComponent(props.document.trim());
    return (
        <iframe
            style={{
                width: '100%',
                minHeight: '500px',
                borderRadius: '8px',
            }}
            src={`https://${props.server ?? 'readonlydemo'}.vendure.io/${props.api}-api?query=${urlEncoded}`}
        />
    );
}
