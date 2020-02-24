import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataModule } from '../data/data.module';
import { SharedModule } from '../shared/shared.module';

import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ChannelSwitcherComponent } from './components/channel-switcher/channel-switcher.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OverlayHostComponent } from './components/overlay-host/overlay-host.component';
import { UiLanguageSwitcherComponent } from './components/ui-language-switcher/ui-language-switcher.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { AuthService } from './providers/auth/auth.service';
import { CustomFieldComponentService } from './providers/custom-field-component/custom-field-component.service';
import { AuthGuard } from './providers/guard/auth.guard';
import { I18nService } from './providers/i18n/i18n.service';
import { JobQueueService } from './providers/job-queue/job-queue.service';
import { LocalStorageService } from './providers/local-storage/local-storage.service';
import { NavBuilderService } from './providers/nav-builder/nav-builder.service';
import { NotificationService } from './providers/notification/notification.service';
import { OverlayHostService } from './providers/overlay-host/overlay-host.service';

@NgModule({
    imports: [DataModule, SharedModule, BrowserAnimationsModule],
    exports: [SharedModule, OverlayHostComponent],
    providers: [
        LocalStorageService,
        AuthGuard,
        AuthService,
        I18nService,
        OverlayHostService,
        NotificationService,
        JobQueueService,
        NavBuilderService,
        CustomFieldComponentService,
    ],
    declarations: [
        AppShellComponent,
        UserMenuComponent,
        MainNavComponent,
        BreadcrumbComponent,
        OverlayHostComponent,
        NotificationComponent,
        UiLanguageSwitcherComponent,
        JobListComponent,
        ChannelSwitcherComponent,
    ],
})
export class CoreModule {}
