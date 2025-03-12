export function Page({ children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="page" {...props}>
            {children}
        </div>
    );
}

export function PageMain({ children, ...props }: React.ComponentProps<'main'>) {
    return (
        <main data-slot="page-main" {...props}>
            {children}
        </main>
    );
}

export function PageSide({ children, ...props }: React.ComponentProps<'aside'>) {
    return (
        <aside data-slot="page-side" {...props}>
            {children}
        </aside>
    );
}
