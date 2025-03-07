import { AnyRoute } from '@tanstack/react-router';

export interface PageProps {
    title: string;
    route: AnyRoute | (() => AnyRoute);
}
