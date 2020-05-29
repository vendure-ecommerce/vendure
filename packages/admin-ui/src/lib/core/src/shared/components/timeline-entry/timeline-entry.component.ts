import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export type TimelineDisplayType = 'success' | 'error' | 'warning' | 'default' | 'muted';

@Component({
    selector: 'vdr-timeline-entry',
    templateUrl: './timeline-entry.component.html',
    styleUrls: ['./timeline-entry.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEntryComponent {
    @Input() displayType: TimelineDisplayType;
    @Input() createdAt: string;
    @Input() name: string;
    @Input() featured: boolean;
    @Input() iconShape?: string | [string, string];
    @Input() isLast?: boolean;

    getIconShape() {
        if (this.iconShape) {
            return typeof this.iconShape === 'string' ? this.iconShape : this.iconShape[0];
        }
    }

    getIconClass() {
        if (this.iconShape) {
            return typeof this.iconShape === 'string' ? '' : this.iconShape[1];
        }
    }
}
