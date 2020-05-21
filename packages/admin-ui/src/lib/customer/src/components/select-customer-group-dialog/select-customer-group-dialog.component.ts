import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Dialog, GetCustomerGroups, GetCustomerList } from '@vendure/admin-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-select-customer-group-dialog',
    templateUrl: './select-customer-group-dialog.component.html',
    styleUrls: ['./select-customer-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCustomerGroupDialogComponent implements Dialog<string[]>, OnInit {
    resolveWith: (result?: string[]) => void;
    groups$: Observable<GetCustomerGroups.Items[]>;
    selectedGroupIds: string[] = [];

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.groups$ = this.dataService.customer
            .getCustomerGroupList()
            .mapStream((res) => res.customerGroups.items);
    }

    cancel() {
        this.resolveWith();
    }

    add() {
        this.resolveWith(this.selectedGroupIds);
    }
}
