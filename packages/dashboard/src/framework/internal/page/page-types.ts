import { AnyRoute } from '@tanstack/react-router';
import React from 'react';

export interface PageProps {
    title: string | React.ReactElement;
    route: AnyRoute | (() => AnyRoute);
}
