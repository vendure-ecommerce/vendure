import { Router } from '@angular/router';
import { useInjector } from '@vendure/admin-ui/react';
import React, { PropsWithChildren } from 'react';

export function Link(props: PropsWithChildren<{ href: string; [props: string]: any }>) {
    const router = useInjector(Router);
    const { href, ...rest } = props;
    function onClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        void router.navigateByUrl(href);
    }
    return (
        <a href={href} onClick={onClick} {...rest}>
            {props.children}
        </a>
    );
}
