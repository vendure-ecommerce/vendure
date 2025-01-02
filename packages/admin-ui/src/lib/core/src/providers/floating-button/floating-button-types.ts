import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface FloatingButtonFunctionContext<ComponentType> {
    injector: Injector;
}

export interface FloatingButton<ComponentType = any> {
    onClick: (injector: Injector) => void;
    routes?: string[] | string;
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
    disabled?: boolean;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    buttonSize?: number;
    backgroundColor?: string;
    visible?: boolean;
}
