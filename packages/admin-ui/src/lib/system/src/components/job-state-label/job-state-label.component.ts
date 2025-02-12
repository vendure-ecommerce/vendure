import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JobInfoFragment, JobState } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-job-state-label',
    templateUrl: './job-state-label.component.html',
    styleUrls: ['./job-state-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobStateLabelComponent {
    @Input()
    job: JobInfoFragment;

    get iconShape(): string {
        switch (this.job.state) {
            case JobState.COMPLETED:
                return 'lucideCircleCheck';
            case JobState.FAILED:
                return 'lucideCircleX';
            case JobState.CANCELLED:
                return 'lucideCircleSlash2';
            case JobState.PENDING:
            case JobState.RETRYING:
                return 'lucideCircleDotDashed';
            case JobState.RUNNING:
                return 'lucideCircleDot';
        }
    }

    get colorType(): string {
        switch (this.job.state) {
            case JobState.COMPLETED:
                return 'success';
            case JobState.FAILED:
            case JobState.CANCELLED:
                return 'error';
            case JobState.PENDING:
            case JobState.RETRYING:
                return '';
            case JobState.RUNNING:
                return 'warning';
        }
    }
}
