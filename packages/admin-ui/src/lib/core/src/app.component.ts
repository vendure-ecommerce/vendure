import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from './data/providers/data.service';

@Component({
    selector: 'vdr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    loading$: Observable<boolean>;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.loading$ = this.dataService.client
            .getNetworkStatus()
            .stream$.pipe(map(data => 0 < data.networkStatus.inFlightRequests));
    }
}
