import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'vdr-page-block',
    templateUrl: './page-block.component.html',
    styleUrls: ['./page-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageBlockComponent {
    @Input() title: string | undefined;
    @Input() description: string | undefined;
}
