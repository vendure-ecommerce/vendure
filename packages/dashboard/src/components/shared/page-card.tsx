import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";

export interface PageCardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function PageCard({ children, title, description }: PageCardProps) {
    return (
        <Card>
            {title || description ? (
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            ) : null}
            <CardContent className={!title ? 'pt-6' : ''}>{children}</CardContent>
        </Card>
    );
}