import { Image } from "lucide-react";

export interface AssetLike {
    preview: string;
    name?: string;
    focalPoint?: { x: number; y: number };
}

export function AssetThumbnail({ value }: { value?: AssetLike }) {
    if (!value) {
        // Placeholder for missing asset
        return <div className="w-[50px] h-[50px] bg-muted rounded-sm flex items-center justify-center"><Image className="w-8 h-8 text-muted-foreground" /></div>;
    }
    let url = value.preview + '?preset=tiny';
    if (value.focalPoint) {
        url += `&fpx=${value.focalPoint.x}&fpy=${value.focalPoint.y}`;
    }
    return <img src={url} alt={value.name} className="rounded-sm" />;
}
