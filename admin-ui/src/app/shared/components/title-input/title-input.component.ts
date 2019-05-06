import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vdr-title-input',
    templateUrl: './title-input.component.html',
    styleUrls: ['./title-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleInputComponent {}
