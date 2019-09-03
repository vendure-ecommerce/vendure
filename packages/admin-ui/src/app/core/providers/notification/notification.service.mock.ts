import { MockOf } from '../../../../testing/testing-types';

import { NotificationService } from './notification.service';

export class MockNotificationService implements MockOf<NotificationService> {
    notify = jasmine.createSpy('notify');
    error = jasmine.createSpy('error');
    info = jasmine.createSpy('info');
    success = jasmine.createSpy('success');
    warning = jasmine.createSpy('warning');
}
