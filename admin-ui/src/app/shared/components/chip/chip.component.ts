import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * A chip component for displaying a label with an optional action icon.
 */
@Component({
    selector: 'vdr-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
    @Input() icon: string;
    @Output() iconClick = new EventEmitter<MouseEvent>();
}
