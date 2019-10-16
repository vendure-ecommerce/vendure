import { DayOfWeek } from '@vendure/admin-ui/src/app/shared/components/datetime-picker/types';

import { _ } from '../../../core/providers/i18n/mark-for-extraction';

export const dayOfWeekIndex: { [day in DayOfWeek]: number } = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

export const weekDayNames = [
    _('datetime.weekday-su'),
    _('datetime.weekday-mo'),
    _('datetime.weekday-tu'),
    _('datetime.weekday-we'),
    _('datetime.weekday-th'),
    _('datetime.weekday-fr'),
    _('datetime.weekday-sa'),
];
