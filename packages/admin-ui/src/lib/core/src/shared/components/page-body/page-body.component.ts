import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vdr-page-body',
    templateUrl: './page-body.component.html',
    styleUrls: ['./page-body.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageBodyComponent {}
