import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DataService } from '@vendure/admin-ui/src/app/data/providers/data.service';

/**
 * Conditionally shows/hides templates based on the current active user having the specified permission.
 * Based on the ngIf source. Also support "else" templates:
 *
 * @example
 * ```html
 * <button *vdrIfPermissions="'DeleteCatalog'; else unauthorized">Delete Product</button>
 * <ng-template #unauthorized>Not allowed!</ng-template>
 * ```
 */
@Directive({
    selector: '[vdrIfPermissions]',
})
export class IfPermissionsDirective {
    private readonly _thenTemplateRef: TemplateRef<any> | null = null;
    private _elseTemplateRef: TemplateRef<any> | null = null;
    private _thenViewRef: EmbeddedViewRef<any> | null = null;
    private _elseViewRef: EmbeddedViewRef<any> | null = null;
    private permissionToCheck = '__initial_value__';

    constructor(
        private _viewContainer: ViewContainerRef,
        templateRef: TemplateRef<any>,
        private dataService: DataService,
    ) {
        this._thenTemplateRef = templateRef;
    }

    /**
     * The permission to check to determine whether to show the template.
     */
    @Input()
    set vdrIfPermissions(permission: string) {
        this.permissionToCheck = permission;
        this._updateView(permission);
    }

    /**
     * A template to show if the current user does not have the speicified permission.
     */
    @Input()
    set vdrIfPermissionsElse(templateRef: TemplateRef<any> | null) {
        assertTemplate('vdrIfPermissionsElse', templateRef);
        this._elseTemplateRef = templateRef;
        this._elseViewRef = null; // clear previous view if any.
        this._updateView(this.permissionToCheck);
    }

    private _updateView(permission: string) {
        this.dataService.client.userStatus().single$.subscribe(({ userStatus }) => {
            if (userStatus.permissions.includes(permission)) {
                if (!this._thenViewRef) {
                    this._viewContainer.clear();
                    this._elseViewRef = null;
                    if (this._thenTemplateRef) {
                        this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef);
                    }
                }
            } else {
                if (!this._elseViewRef) {
                    this._viewContainer.clear();
                    this._thenViewRef = null;
                    if (this._elseTemplateRef) {
                        this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef);
                    }
                }
            }
        });
    }
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
    const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
    if (!isTemplateRefOrNull) {
        throw new Error(`${property} must be a TemplateRef, but received '${templateRef}'.`);
    }
}
