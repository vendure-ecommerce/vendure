import { DashboardBaseWidget } from '@/framework/dashboard-widget/base-widget.js';

export function ExampleWidget() {
    return (
        <DashboardBaseWidget
            id="example-widget"
            config={{}}
            title="Example Widget"
            description="This is an example widget"
        >
            this is my widget
        </DashboardBaseWidget>
    );
}
