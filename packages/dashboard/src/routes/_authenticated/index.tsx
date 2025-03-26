import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
    component: DashboardPage,
});

function DashboardPage() {
    return <div>Hello from the dashboard</div>;
}
