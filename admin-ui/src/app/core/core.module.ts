import { NgModule } from '@angular/core';
import { DataModule } from '../data/data.module';
import { SharedModule } from '../shared/shared.module';
import { StateModule } from '../state/state.module';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OverlayHostComponent } from './components/overlay-host/overlay-host.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { AuthService } from './providers/auth/auth.service';
import { AuthGuard } from './providers/guard/auth.guard';
import { LocalStorageService } from './providers/local-storage/local-storage.service';
import { NotificationService } from './providers/notification/notification.service';
import { OverlayHostService } from './providers/overlay-host/overlay-host.service';

@NgModule({
    imports: [
        DataModule,
        SharedModule,
        StateModule,
    ],
    exports: [
        SharedModule,
        OverlayHostComponent,
    ],
    providers: [
        LocalStorageService,
        AuthGuard,
        AuthService,
        OverlayHostService,
        NotificationService,
    ],
    declarations: [AppShellComponent, UserMenuComponent, MainNavComponent, BreadcrumbComponent, OverlayHostComponent, NotificationComponent],
    entryComponents: [NotificationComponent],
})
export class CoreModule {}
