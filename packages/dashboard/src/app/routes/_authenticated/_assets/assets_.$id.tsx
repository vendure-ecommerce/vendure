import { AssetFocalPointEditor } from '@/vdb/components/shared/asset/asset-focal-point-editor.js';
import { AssetPreviewSelector } from '@/vdb/components/shared/asset/asset-preview-selector.js';
import { PreviewPreset } from '@/vdb/components/shared/asset/asset-preview.js';
import { AssetProperties } from '@/vdb/components/shared/asset/asset-properties.js';
import { Point } from '@/vdb/components/shared/asset/focal-point-control.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { VendureImage } from '@/vdb/components/shared/vendure-image.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Label } from '@/vdb/components/ui/label.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/vdb/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { createFileRoute } from '@tanstack/react-router';
import { FocusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { assetDetailDocument, assetUpdateDocument } from './assets.graphql.js';

const pageId = 'asset-detail';

export const Route = createFileRoute('/_authenticated/_assets/assets_/$id')({
    component: AssetDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: assetDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/assets', label: 'Assets' },
                isNew ? <Trans>New asset</Trans> : (entity?.name ?? ''),
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
    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
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
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                <Trans>Edit asset</Trans>
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateChannel']}>
                        <Button type="submit" disabled={!form.formState.isDirty || isPending}>
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
                            onFocalPointChange={point => {
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
                <CustomFieldsPageBlock column="main" entityType={'Asset'} control={form.control} />
                <PageBlock column="side" blockId="asset-properties">
                    <AssetProperties asset={entity} />
                </PageBlock>
                <PageBlock column="side" blockId="asset-size">
                    <div className="flex flex-col gap-2">
                        <AssetPreviewSelector size={size} setSize={setSize} width={width} height={height} />
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setSettingFocalPoint(true)}
                            >
                                <FocusIcon className="h-4 w-4" />
                            </Button>
                            <div className="text-sm text-muted-foreground">
                                <Label>
                                    <Trans>Focal Point</Trans>
                                </Label>
                                <div className="text-sm text-muted-foreground">
                                    {form.getValues().focalPoint?.x && form.getValues().focalPoint?.y ? (
                                        `${form.getValues().focalPoint?.x.toFixed(2)}, ${form.getValues().focalPoint?.y.toFixed(2)}`
                                    ) : (
                                        <Trans>Not set</Trans>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
