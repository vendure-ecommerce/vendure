export interface AssetLike {
    preview: string;
    name?: string;
    focalPoint?: { x: number; y: number };
}

export function AssetThumbnail({ value }: { value: AssetLike }) {
    let url = value.preview + '?preset=tiny';
    if (value.focalPoint) {
        url += `&fpx=${value.focalPoint.x}&fpy=${value.focalPoint.y}`;
    }
    return <img src={url} alt={value.name} className="rounded-sm" />;
}
