import { Component } from '@angular/core';
import { ADMIN_UI_VERSION } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    version = ADMIN_UI_VERSION;
}
