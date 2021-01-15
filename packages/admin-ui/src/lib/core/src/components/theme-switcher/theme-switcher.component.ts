import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../data/providers/data.service';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';

@Component({
    selector: 'vdr-theme-switcher',
    templateUrl: './theme-switcher.component.html',
    styleUrls: ['./theme-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent implements OnInit {
    activeTheme$: Observable<string>;

    constructor(private dataService: DataService, private localStorageService: LocalStorageService) {}

    ngOnInit() {
        this.activeTheme$ = this.dataService.client.uiState().mapStream(data => data.uiState.theme);
    }

    toggleTheme(current: string) {
        const newTheme = current === 'default' ? 'dark' : 'default';
        this.dataService.client.setUiTheme(newTheme).subscribe(() => {
            this.localStorageService.set('activeTheme', newTheme);
        });
    }
}
