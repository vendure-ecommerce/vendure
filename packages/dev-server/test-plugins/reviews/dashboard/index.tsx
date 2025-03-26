import { defineDashboardExtension } from '@vendure/dashboard';
import { CustomWidget } from './custom-widget';
import { reviewDetail } from './review-detail';
import { reviewList } from './review-list';

export default defineDashboardExtension({
    routes: [reviewList, reviewDetail],
    widgets: [
        {
            id: 'custom-widget',
            name: 'Custom Widget',
            component: CustomWidget,
            defaultSize: { w: 3, h: 3 },
        },
    ],
});
