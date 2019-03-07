import { Component } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Component({
    selector: 'vdr-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    version = environment.version;
}
