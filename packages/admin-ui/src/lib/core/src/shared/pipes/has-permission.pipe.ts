import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DataService } from '../../data/providers/data.service';

/**
 * A pipe which checks the provided permission against all the permissions of the current user.
 * Returns `true` if the current user has that permission.
 *
 * @example
 * ```
 * <button [disabled]="!('UpdateCatalog' | hasPermission)">Save Changes</button>
 * ```
 */
@Pipe({
    name: 'hasPermission',
    pure: false,
})
export class HasPermissionPipe implements PipeTransform, OnDestroy {
    private hasPermission = false;
    private currentPermissions$: Observable<string[]>;
    private lastPermissions: string | null = null;
    private subscription: Subscription;

    constructor(private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) {
        this.currentPermissions$ = this.dataService.client
            .userStatus()
            .mapStream(data => data.userStatus.permissions);
    }

    transform(input: string | string[]): any {
        const requiredPermissions = Array.isArray(input) ? input : [input];
        const requiredPermissionsString = requiredPermissions.join(',');
        if (this.lastPermissions !== requiredPermissionsString) {
            this.lastPermissions = requiredPermissionsString;
            this.hasPermission = false;
            this.dispose();
            this.subscription = this.currentPermissions$.subscribe(permissions => {
                this.hasPermission = this.checkPermissions(permissions, requiredPermissions);
                this.changeDetectorRef.markForCheck();
            });
        }

        return this.hasPermission;
    }

    ngOnDestroy() {
        this.dispose();
    }

    private checkPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
        for (const perm of requiredPermissions) {
            if (userPermissions.includes(perm)) {
                return true;
            }
        }
        return false;
    }

    private dispose() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
