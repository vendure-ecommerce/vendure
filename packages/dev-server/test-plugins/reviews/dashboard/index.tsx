import { defineDashboardExtension } from '@vendure/dashboard';

import { reviewDetail } from './review-detail';
import { reviewList } from './review-list';

export default defineDashboardExtension({
    routes: [reviewList, reviewDetail],
});
