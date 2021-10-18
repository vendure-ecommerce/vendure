import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CreateRoleInput,
    DataService,
    LanguageCode,
    NotificationService,
    Permission,
    PermissionDefinition,
    Role,
    ServerConfigService,
    UpdateRoleInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { unique } from '@vendure/common/lib/unique';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-role-detail',
    templateUrl: './role-detail.component.html',
    styleUrls: ['./role-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDetailComponent extends BaseDetailComponent<Role> implements OnInit, OnDestroy {
    role$: Observable<Role>;
    detailForm: FormGroup;
    permissionDefinitions: PermissionDefinition[];
    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.detailForm = this.formBuilder.group({
            code: ['', Validators.required],
            description: ['', Validators.required],
            channelIds: [],
            permissions: [],
        });
    }

    ngOnInit() {
        this.init();
        this.role$ = this.entity$;
        this.permissionDefinitions = this.serverConfigService.getPermissionDefinitions();
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    updateCode(nameValue: string) {
        const codeControl = this.detailForm.get(['code']);
        if (codeControl && codeControl.pristine) {
            codeControl.setValue(normalizeString(nameValue, '-'));
        }
    }

    setPermission(change: { permission: string; value: boolean }) {
        const permissionsControl = this.detailForm.get('permissions');
        if (permissionsControl) {
            const currentPermissions = permissionsControl.value as string[];
            const newValue =
                change.value === true
                    ? unique([...currentPermissions, change.permission])
                    : currentPermissions.filter(p => p !== change.permission);
            permissionsControl.setValue(newValue);
            permissionsControl.markAsDirty();
        }
    }

    create() {
        const formValue = this.detailForm.value;
        const role: CreateRoleInput = formValue;
        this.dataService.administrator.createRole(role).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), { entity: 'Role' });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createRole.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'Role',
                });
            },
        );
    }

    save() {
        this.role$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const role: UpdateRoleInput = { id, ...formValue };
                    return this.dataService.administrator.updateRole(role);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), { entity: 'Role' });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Role',
                    });
                },
            );
    }

    protected setFormValues(role: Role, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            description: role.description,
            code: role.code,
            channelIds: role.channels.map(c => c.id),
            permissions: role.permissions,
        });
        // This was required to get the channel selector component to
        // correctly display its contents. A while spent debugging the root
        // cause did not yield a solution, therefore this next line.
        this.changeDetector.detectChanges();
    }
}
