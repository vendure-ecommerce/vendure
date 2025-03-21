import { defineDashboardExtension } from '@vendure/dashboard';

import { reviewList } from './review-list';

export default defineDashboardExtension({
    routes: [reviewList],
});
