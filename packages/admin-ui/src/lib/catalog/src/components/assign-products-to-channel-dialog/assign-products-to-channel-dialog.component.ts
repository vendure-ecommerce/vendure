import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { GetChannels, ProductVariantFragment } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { Dialog } from '@vendure/admin-ui/core';
import { combineLatest, from, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-assign-products-to-channel-dialog',
    templateUrl: './assign-products-to-channel-dialog.component.html',
    styleUrls: ['./assign-products-to-channel-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignProductsToChannelDialogComponent implements OnInit, Dialog<any> {
    selectedChannel: GetChannels.Channels | null | undefined;
    currentChannel: GetChannels.Channels;
    availableChannels: GetChannels.Channels[];
    resolveWith: (result?: any) => void;
    variantsPreview$: Observable<Array<{ id: string; name: string; price: number; pricePreview: number }>>;
    priceFactorControl = new FormControl(1);
    selectedChannelIdControl = new FormControl();

    // assigned by ModalService.fromComponent() call
    productIds: string[];
    productVariantIds: string[] | undefined;
    currentChannelIds: string[];

    get isProductVariantMode(): boolean {
        return this.productVariantIds != null;
    }

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    ngOnInit() {
        const activeChannelId$ = this.dataService.client
            .userStatus()
            .mapSingle(({ userStatus }) => userStatus.activeChannelId);
        const allChannels$ = this.dataService.settings.getChannels().mapSingle(data => data.channels);

        combineLatest(activeChannelId$, allChannels$).subscribe(([activeChannelId, channels]) => {
            // tslint:disable-next-line:no-non-null-assertion
            this.currentChannel = channels.find(c => c.id === activeChannelId)!;
            this.availableChannels = channels;
        });

        this.selectedChannelIdControl.valueChanges.subscribe(ids => {
            this.selectChannel(ids);
        });

        this.variantsPreview$ = combineLatest(
            from(this.getTopVariants(10)),
            this.priceFactorControl.valueChanges.pipe(startWith(1)),
        ).pipe(
            map(([variants, factor]) => {
                return variants.map(v => ({
                    id: v.id,
                    name: v.name,
                    price: v.price,
                    pricePreview: v.price * +factor,
                }));
            }),
        );
    }

    selectChannel(channelIds: string[]) {
        this.selectedChannel = this.availableChannels.find(c => c.id === channelIds[0]);
    }

    assign() {
        const selectedChannel = this.selectedChannel;
        if (selectedChannel) {
            if (!this.isProductVariantMode) {
                this.dataService.product
                    .assignProductsToChannel({
                        channelId: selectedChannel.id,
                        productIds: this.productIds,
                        priceFactor: +this.priceFactorControl.value,
                    })
                    .subscribe(() => {
                        this.notificationService.success(_('catalog.assign-product-to-channel-success'), {
                            channel: selectedChannel.code,
                        });
                        this.resolveWith(true);
                    });
            } else if (this.productVariantIds) {
                this.dataService.product
                    .assignVariantsToChannel({
                        channelId: selectedChannel.id,
                        productVariantIds: this.productVariantIds,
                        priceFactor: +this.priceFactorControl.value,
                    })
                    .subscribe(() => {
                        this.notificationService.success(_('catalog.assign-variant-to-channel-success'), {
                            channel: selectedChannel.code,
                        });
                        this.resolveWith(true);
                    });
            }
        }
    }

    cancel() {
        this.resolveWith();
    }

    private async getTopVariants(take: number): Promise<ProductVariantFragment[]> {
        const variants: ProductVariantFragment[] = [];

        for (let i = 0; i < this.productIds.length && variants.length < take; i++) {
            const productVariants = await this.dataService.product
                .getProduct(this.productIds[i])
                .mapSingle(({ product }) => {
                    const _variants = product ? product.variants : [];
                    return _variants.filter(v =>
                        this.isProductVariantMode ? this.productVariantIds?.includes(v.id) : true,
                    );
                })
                .toPromise();
            variants.push(...(productVariants || []));
        }
        return variants.slice(0, take);
    }
}
