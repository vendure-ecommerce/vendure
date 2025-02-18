import { Button } from '@/components/ui/button.js';
import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: HomeComponent,
});

function HomeComponent() {
    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
            <Button>Click me</Button>
        </div>
    );
}
