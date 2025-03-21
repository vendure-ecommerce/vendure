import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_authenticated/"!</div>;
}
