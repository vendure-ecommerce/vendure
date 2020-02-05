import { APP_INITIALIZER, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    AssetPickerDialogComponent,
    CustomFieldComponentService,
    CustomFieldConfig,
    CustomFieldControl,
    DataService,
    ModalService,
    NavBuilderService,
    SharedModule,
} from '@vendure/admin-ui/src';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
    template: `
        <input
            type="range"
            [min]="customFieldConfig.intMin"
            [max]="customFieldConfig.intMax"
            [formControl]="formControl"
        />
        {{ formControl.value }}
    `,
})
export class SliderControl implements CustomFieldControl {
    customFieldConfig: CustomFieldConfig;
    formControl: FormControl;
}

@Component({
    template: `
        <div class="featured-asset">
            <img
                *ngIf="currentAsset$ | async as asset; else placeholder"
                [src]="asset!.preview + '?preset=thumb'"
            />
            <ng-template #placeholder>
                <div class="placeholder">
                    <clr-icon shape="image" size="128"></clr-icon>
                    <div>{{ 'catalog.no-featured-asset' | translate }}</div>
                </div>
            </ng-template>
        </div>
        <button class="btn" (click)="selectAssets()">
            <clr-icon shape="attachment"></clr-icon>
            {{ 'asset.add-asset' | translate }}
        </button>
    `,
})
export class AssetPickerControl implements CustomFieldControl, OnInit {
    customFieldConfig: CustomFieldConfig;
    formControl: FormControl;
    currentAsset$: Observable<any | null>;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: ModalService,
        private dataService: DataService,
    ) {}

    ngOnInit(): void {
        this.currentAsset$ = this.formControl.valueChanges.pipe(
            startWith(this.formControl.value),
            switchMap(assetId => {
                if (!assetId) {
                    return of(null);
                }
                return this.dataService
                    .query(
                        gql`
                            query($id: ID!) {
                                asset(id: $id) {
                                    id
                                    name
                                    preview
                                    width
                                    height
                                }
                            }
                        `,
                        { id: assetId },
                    )
                    .mapStream((data: any) => data.asset);
            }),
        );
    }

    selectAssets() {
        this.modalService
            .fromComponent(AssetPickerDialogComponent, {
                size: 'xl',
            })
            .subscribe((result: any) => {
                if (result && result.length) {
                    this.formControl.setValue(result[0].id);
                    this.formControl.markAsDirty();
                    // this.changeDetectorRef.markForCheck();
                }
            });
    }
}

@NgModule({
    imports: [SharedModule],
    declarations: [SliderControl, AssetPickerControl],
    entryComponents: [SliderControl, AssetPickerControl],
    providers: [
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: addNavItems,
            deps: [NavBuilderService],
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: registerCustomFieldComponents,
            deps: [CustomFieldComponentService],
        },
    ],
})
export class TestSharedModule {}

export function registerCustomFieldComponents(customFieldComponentService: CustomFieldComponentService) {
    return () => {
        customFieldComponentService.registerCustomFieldComponent('Product', 'length', SliderControl);
        customFieldComponentService.registerCustomFieldComponent('ProductVariant', 'length', SliderControl);
        customFieldComponentService.registerCustomFieldComponent(
            'Product',
            'offerImageId',
            AssetPickerControl,
        );
    };
}

export function addNavItems(navBuilder: NavBuilderService) {
    return () => {
        navBuilder.addNavMenuSection(
            {
                id: 'test-plugin',
                label: 'UI Test Plugin',
                items: [
                    {
                        id: 'js-app',
                        label: 'Plain JS App',
                        routerLink: ['/extensions/js-app'],
                        icon: 'code',
                    },
                    {
                        id: 'vue-app',
                        label: 'Vue App',
                        routerLink: ['/extensions/vue-app'],
                        icon: 'code',
                    },
                ],
            },
            'settings',
        );
    };
}
