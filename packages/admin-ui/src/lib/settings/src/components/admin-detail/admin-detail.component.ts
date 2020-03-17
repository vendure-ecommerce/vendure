import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { BaseDetailComponent } from '@vendure/admin-ui/core';
import {
    Administrator,
    CreateAdministratorInput,
    GetAdministrator,
    LanguageCode,
    Permission,
    Role,
    RoleFragment,
    UpdateAdministratorInput,
} from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';

export interface PermissionsByChannel {
    channelId: string;
    channelCode: string;
    permissions: { [K in Permission]: boolean };
}

@Component({
    selector: 'vdr-admin-detail',
    templateUrl: './admin-detail.component.html',
    styleUrls: ['./admin-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDetailComponent extends BaseDetailComponent<GetAdministrator.Administrator>
    implements OnInit, OnDestroy {
    administrator$: Observable<GetAdministrator.Administrator>;
    allRoles$: Observable<Role.Fragment[]>;
    selectedRoles: Role.Fragment[] = [];
    detailForm: FormGroup;
    selectedRolePermissions: { [channelId: string]: PermissionsByChannel } = {} as any;
    selectedChannelId: string | null = null;

    getAvailableChannels(): PermissionsByChannel[] {
        return Object.values(this.selectedRolePermissions);
    }

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);
        this.detailForm = this.formBuilder.group({
            emailAddress: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: [''],
            roles: [[]],
        });
    }

    ngOnInit() {
        this.init();
        this.administrator$ = this.entity$;
        this.allRoles$ = this.dataService.administrator.getRoles(99999).mapStream(item => item.roles.items);
        this.dataService.client.userStatus().single$.subscribe(({ userStatus }) => {
            if (!userStatus.permissions.includes(Permission.UpdateAdministrator)) {
                const rolesSelect = this.detailForm.get('roles');
                if (rolesSelect) {
                    rolesSelect.disable();
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    rolesChanged(roles: Role[]) {
        this.buildPermissionsMap();
    }

    getPermissionsForSelectedChannel() {
        if (this.selectedChannelId) {
            const selectedChannel = this.selectedRolePermissions[this.selectedChannelId];
            if (selectedChannel) {
                return this.selectedRolePermissions[this.selectedChannelId].permissions;
            }
        }
        const channels = Object.values(this.selectedRolePermissions);
        if (0 < channels.length) {
            this.selectedChannelId = channels[0].channelId;
            return channels[0].permissions;
        }
        return [];
    }

    create() {
        const formValue = this.detailForm.value;
        const administrator: CreateAdministratorInput = {
            emailAddress: formValue.emailAddress,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            password: formValue.password,
            roleIds: formValue.roles.map(role => role.id),
        };
        this.dataService.administrator.createAdministrator(administrator).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'Administrator',
                });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createAdministrator.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'Administrator',
                });
            },
        );
    }

    save() {
        this.administrator$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const administrator: UpdateAdministratorInput = {
                        id,
                        emailAddress: formValue.emailAddress,
                        firstName: formValue.firstName,
                        lastName: formValue.lastName,
                        password: formValue.password,
                        roleIds: formValue.roles.map(role => role.id),
                    };
                    return this.dataService.administrator.updateAdministrator(administrator);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Administrator',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Administrator',
                    });
                },
            );
    }

    protected setFormValues(administrator: Administrator, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            emailAddress: administrator.emailAddress,
            firstName: administrator.firstName,
            lastName: administrator.lastName,
            roles: administrator.user.roles,
        });
        const passwordControl = this.detailForm.get('password');
        if (passwordControl) {
            if (!administrator.id) {
                passwordControl.setValidators([Validators.required]);
            } else {
                passwordControl.setValidators([]);
            }
        }
        this.buildPermissionsMap();
    }

    private buildPermissionsMap() {
        const permissionsControl = this.detailForm.get('roles');
        if (permissionsControl) {
            const roles: RoleFragment[] = permissionsControl.value;
            const channelIdPermissionsMap = new Map<string, Set<Permission>>();
            const channelIdCodeMap = new Map<string, string>();

            for (const role of roles) {
                for (const channel of role.channels) {
                    const channelPermissions = channelIdPermissionsMap.get(channel.id);
                    const permissionSet = channelPermissions || new Set<Permission>();

                    role.permissions.forEach(p => permissionSet.add(p));
                    channelIdPermissionsMap.set(channel.id, permissionSet);
                    channelIdCodeMap.set(channel.id, channel.code);
                }
            }

            this.selectedRolePermissions = {} as any;
            for (const channelId of Array.from(channelIdPermissionsMap.keys())) {
                // tslint:disable-next-line:no-non-null-assertion
                const permissionSet = channelIdPermissionsMap.get(channelId)!;
                const permissionsHash: { [K in Permission]: boolean } = {} as any;
                for (const permission of Object.keys(Permission)) {
                    permissionsHash[permission] = permissionSet.has(permission as Permission);
                }
                this.selectedRolePermissions[channelId] = {
                    // tslint:disable:no-non-null-assertion
                    channelId,
                    channelCode: channelIdCodeMap.get(channelId)!,
                    permissions: permissionsHash,
                    // tslint:enable:no-non-null-assertion
                };
            }
        }
    }
}
