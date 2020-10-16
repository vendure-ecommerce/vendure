import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'vdr-help-tooltip',
    templateUrl: './help-tooltip.component.html',
    styleUrls: ['./help-tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpTooltipComponent {
    @Input() content: string;
}
