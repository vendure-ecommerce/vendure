import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HealthCheckService } from '@uplab/admin-ui/core';

@Component({
    selector: 'vdr-health-check',
    templateUrl: './health-check.component.html',
    styleUrls: ['./health-check.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCheckComponent {
    constructor(public healthCheckService: HealthCheckService) {}
}
