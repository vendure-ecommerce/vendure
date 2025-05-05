import { AssetPreview } from '@/components/shared/asset/asset-preview.js'
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { createFileRoute } from '@tanstack/react-router'
import { assetDetailDocument, assetUpdateDocument } from './assets.graphql.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { toast } from 'sonner';
import { Page, PageTitle, PageActionBar, PageActionBarRight, PageBlock, PageLayout, CustomFieldsPageBlock } from '@/framework/layout-engine/page-layout.js'
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { VendureImage } from '@/components/shared/vendure-image.js';
import { useState, useRef } from 'react';
import { PreviewPreset } from '@/components/shared/asset/asset-preview.js';
import { AssetPreviewSelector } from '@/components/shared/asset/asset-preview-selector.js';
import { AssetProperties } from '@/components/shared/asset/asset-properties.js';
import { AssetFocalPointEditor } from '@/components/shared/asset/asset-focal-point-editor.js';
import { FocusIcon } from 'lucide-react';
import { Point } from '@/components/shared/asset/focal-point-control.js';
import { Label } from '@/components/ui/label.js';
export const Route = createFileRoute('/_authenticated/_assets/assets_/$id')({
    component: AssetDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: assetDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/assets', label: 'Assets' },
                isNew ? <Trans>New asset</Trans> : entity?.name ?? '',
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function AssetDetailPage() {
    const params = Route.useParams();
    const { i18n } = useLingui();

    const imageRef = useRef<HTMLImageElement>(null);
    const [size, setSize] = useState<PreviewPreset>('medium');
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [focalPoint, setFocalPoint] = useState<Point | undefined>(undefined);
    const [settingFocalPoint, setSettingFocalPoint] = useState(false);
    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: assetDetailDocument,
        updateDocument: assetUpdateDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                focalPoint: entity.focalPoint,
                name: entity.name,
                tags: entity.tags?.map(tag => tag.value) ?? [],
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async () => {
            toast(i18n.t('Successfully updated asset'));
            form.reset(form.getValues());
        },
        onError: err => {
            toast(i18n.t('Failed to update asset'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const updateDimensions = () => {
        if (!imageRef.current) return;
        const img = imageRef.current;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        setWidth(imgWidth);
        setHeight(imgHeight);
    };

    if (!entity) {
        return null;
    }
    return (
        <Page pageId="asset-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>
                <Trans>Edit asset</Trans>
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateChannel']}>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || isPending}
                        >
                            <Trans>Update</Trans>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="asset-preview">
                    <div className="relative flex items-center justify-center bg-muted/30 rounded-lg min-h-[300px] overflow-auto">
                        <AssetFocalPointEditor
                            width={width}
                            height={height}
                            settingFocalPoint={settingFocalPoint}
                            focalPoint={form.getValues().focalPoint ?? { x: 0.5, y: 0.5 }}
                            onFocalPointChange={(point) => {
                                form.setValue('focalPoint.x', point.x, { shouldDirty: true });
                                form.setValue('focalPoint.y', point.y, { shouldDirty: true });
                                setSettingFocalPoint(false);
                            }}
                            onCancel={() => {
                                setSettingFocalPoint(false);
                            }}
                        >
                            <VendureImage
                                ref={imageRef}
                                asset={entity}
                                preset={size || undefined}
                                mode="resize"
                                useFocalPoint={true}
                                onLoad={updateDimensions}
                                className="max-w-full max-h-full object-contain"
                            />
                        </AssetFocalPointEditor>
                    </div>
                </PageBlock>
                <CustomFieldsPageBlock
                    column="main"
                    entityType={'Asset'}
                    control={form.control}
                />
                <PageBlock column="side" blockId="asset-properties">
                    <AssetProperties asset={entity} />
                </PageBlock>
                <PageBlock column="side" blockId="asset-size">
                    <div className="flex flex-col gap-2">
                        <AssetPreviewSelector size={size} setSize={setSize} width={width} height={height} />
                        <div className="flex items-center gap-2">
                            <Button type='button' variant="outline" size="icon" onClick={() => setSettingFocalPoint(true)}>
                                <FocusIcon className="h-4 w-4" />
                            </Button>
                            <div className="text-sm text-muted-foreground">
                                <Label><Trans>Focal Point</Trans></Label>
                                <div className="text-sm text-muted-foreground">
                                    {form.getValues().focalPoint?.x && form.getValues().focalPoint?.y
                                        ? `${form.getValues().focalPoint?.x.toFixed(2)}, ${form.getValues().focalPoint?.y.toFixed(2)}`
                                        : <Trans>Not set</Trans>}
                                </div>
                            </div>
                        </div>
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    )
}
