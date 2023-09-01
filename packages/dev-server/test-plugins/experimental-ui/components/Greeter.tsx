import { NotificationService } from '@vendure/admin-ui/core';
import { useInjector } from '@vendure/admin-ui/react';
import React from 'react';

export function Greeter(props: { name: string }) {
    const notificationService = useInjector(NotificationService);

    function handleClick() {
        notificationService.success('You clicked me!');
    }
    return (
        <div className="page-block">
            <h2>Hello {props.name}</h2>
            <button className="button primary" onClick={handleClick}>
                Click me
            </button>
        </div>
    );
}
