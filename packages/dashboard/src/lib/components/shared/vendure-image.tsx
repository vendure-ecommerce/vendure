import { cn } from '@/vdb/lib/utils.js';
import { Image } from 'lucide-react';
import React from 'react';

export interface AssetLike {
    id: string;
    preview: string; // Base URL of the asset
    name?: string | null;
    focalPoint?: { x: number; y: number } | null;
}

export type ImagePreset = 'tiny' | 'thumb' | 'small' | 'medium' | 'large' | null;
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | null;
export type ImageMode = 'crop' | 'resize' | null;

export interface VendureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    asset: AssetLike | null | undefined;
    preset?: ImagePreset;
    mode?: ImageMode;
    width?: number;
    height?: number;
    format?: ImageFormat;
    quality?: number;
    useFocalPoint?: boolean; // Whether to use the asset's focal point in crop mode
    fallback?: React.ReactNode; // What to show if no asset is provided
    ref?: React.Ref<HTMLImageElement>;
}

export function VendureImage({
    asset,
    preset = null,
    mode = null,
    width,
    height,
    format = null,
    quality,
    useFocalPoint = true,
    fallback = null,
    alt,
    className,
    style,
    ref,
    ...imgProps
}: VendureImageProps) {
    if (!asset) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <PlaceholderImage preset={preset} width={width} height={height} className={className} />
        );
    }

    // Build the URL with query parameters
    const url = new URL(asset.preview);

    // Handle preset if specified
    if (preset) {
        url.searchParams.set('preset', preset);
    } else {
        // Or handle custom dimensions and mode
        if (width) url.searchParams.set('w', width.toString());
        if (height) url.searchParams.set('h', height.toString());
        if (mode) url.searchParams.set('mode', mode);
    }

    // Add format if specified
    if (format) {
        url.searchParams.set('format', format);
    }

    // Add quality if specified
    if (quality) {
        url.searchParams.set('q', quality.toString());
    }

    // Apply focal point if available and requested
    if (useFocalPoint && asset.focalPoint) {
        url.searchParams.set('fpx', asset.focalPoint.x.toString());
        url.searchParams.set('fpy', asset.focalPoint.y.toString());
    }

    const minDimensions = getMinDimensions(preset, width, height);

    return (
        <img
            src={url.toString()}
            alt={alt || asset.name || ''}
            className={cn(className, 'rounded-sm')}
            width={minDimensions.width}
            height={minDimensions.height}
            style={style}
            loading="lazy"
            ref={ref}
            {...imgProps}
        />
    );
}

function getMinDimensions(preset?: ImagePreset, width?: number, height?: number) {
    if (preset) {
        switch (preset) {
            case 'tiny':
                return { width: 50, height: 50 };
            case 'thumb':
                return { width: 150, height: 150 };
            case 'small':
                return { width: 300, height: 300 };
            case 'medium':
                return { width: 500, height: 500 };
        }
    }

    if (width && height) {
        return { width, height };
    }

    return { width: 100, height: 100 };
}

export function PlaceholderImage({
    width = 100,
    height = 100,
    preset = null,
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { preset?: ImagePreset }) {
    if (preset) {
        switch (preset) {
            case 'tiny':
                width = 50;
                height = 50;
                break;
            case 'thumb':
                width = 150;
                height = 150;
                break;
            case 'small':
                width = 300;
                height = 300;
                break;
            case 'medium':
                width = 500;
                height = 500;
                break;
            case 'large':
                width = 800;
                height = 800;
                break;
            default:
                break;
        }
    }
    return (
        <div className={cn(className, 'rounded-sm bg-muted')} style={{ width, height }} {...props}>
            <Image className="w-full h-full text-muted-foreground" />
        </div>
    );
}

// Convenience components for common use cases
export function Thumbnail({
    asset,
    size = 'thumb',
    ...props
}: Omit<VendureImageProps, 'preset'> & { size?: ImagePreset }) {
    return <VendureImage asset={asset} preset={size} {...props} />;
}

export function CroppedImage({ asset, width, height, ...props }: Omit<VendureImageProps, 'mode'>) {
    return <VendureImage asset={asset} mode="crop" width={width} height={height} {...props} />;
}

export function ResponsiveImage({
    asset,
    sizes = '100vw',
    ...props
}: VendureImageProps & { sizes?: string }) {
    // Setup srcset with multiple sizes
    const srcSet = [
        `${asset?.preview}?w=320&mode=resize 320w`,
        `${asset?.preview}?w=480&mode=resize 480w`,
        `${asset?.preview}?w=640&mode=resize 640w`,
        `${asset?.preview}?w=1024&mode=resize 1024w`,
        `${asset?.preview}?w=1280&mode=resize 1280w`,
    ].join(', ');

    return <VendureImage asset={asset} srcSet={srcSet} sizes={sizes} {...props} />;
}
