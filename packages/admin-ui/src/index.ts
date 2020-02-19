// This is the "public API" of the admin-ui package, used by plugins which want to define
// extensions to the admin UI and need to import components (services, modules etc) from the admin-ui.

export { JobQueueService } from './app/core/providers/job-queue/job-queue.service';
export { LocalStorageService } from './app/core/providers/local-storage/local-storage.service';
export { NotificationService } from './app/core/providers/notification/notification.service';
export { DataModule } from './app/data/data.module';
export { DataService } from './app/data/providers/data.service';
export { ServerConfigService } from './app/data/server-config';
export * from './app/shared/providers/modal/modal.service';
export { SharedModule } from './app/shared/shared.module';
export { NavBuilderService } from './app/core/providers/nav-builder/nav-builder.service';
export { BaseListComponent } from './app/common/base-list.component';
export { BaseDetailComponent } from './app/common/base-detail.component';
export { BaseEntityResolver } from './app/common/base-entity-resolver';
export * from './app/core/providers/nav-builder/nav-builder-types';
export * from './app/core/providers/custom-field-component/custom-field-component.service';
export * from './app/shared/shared-declarations';
export * from './app/shared/providers/routing/can-deactivate-detail-guard';
