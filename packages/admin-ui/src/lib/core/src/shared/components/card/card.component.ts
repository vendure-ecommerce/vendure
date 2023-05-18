import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'vdr-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    @Input() title: string;
    @Input() paddingX = true;
}
