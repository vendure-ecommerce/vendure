import { ChangeDetectionStrategy, Component, HostBinding, Input, isDevMode, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UIExtensionLocationId } from '../../../common/component-registry-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-ui-extension-point',
    templateUrl: './ui-extension-point.component.html',
    styleUrls: ['./ui-extension-point.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiExtensionPointComponent implements OnInit {
    @Input() locationId: UIExtensionLocationId;
    @Input() topPx: number;
    @Input() leftPx: number;
    @HostBinding('style.display')
    @Input()
    display: 'block' | 'inline-block' = 'inline-block';
    @Input() api: 'actionBar' | 'navMenu' | 'detailComponent';
    display$: Observable<boolean>;
    readonly isDevMode = isDevMode();
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.display$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.displayUiExtensionPoints);
    }
}
