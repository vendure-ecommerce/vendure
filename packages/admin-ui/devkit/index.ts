// This is the "public API" of the admin-ui package, used by plugins which want to define
// extensions to the admin UI and need to import components (services, modules etc) from the admin-ui.

export { JobQueueService } from '../src/app/core/providers/job-queue/job-queue.service';
export { LocalStorageService } from '../src/app/core/providers/local-storage/local-storage.service';
export { NotificationService } from '../src/app/core/providers/notification/notification.service';
export { DataModule } from '../src/app/data/data.module';
export { DataService } from '../src/app/data/providers/data.service';
export { ServerConfigService } from '../src/app/data/server-config';
export { ModalService } from '../src/app/shared/providers/modal/modal.service';
export { SharedModule } from '../src/app/shared/shared.module';
export * from '../src/app/shared/shared-declarations';
