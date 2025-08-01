import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button.js';

/**
 * DetailPageButton is a reusable navigation component designed to provide consistent UX
 * across list views when linking to detail pages. It renders as a ghost button with
 * a chevron indicator, making it easy for users to identify clickable links that
 * navigate to detail views.
 *
 * @component
 * @example
 * // Basic usage with ID (relative navigation)
 * <DetailPageButton id="123" label="Product Name" />
 *
 * @example
 * // Custom href with search params
 * <DetailPageButton
 *   href="/products/detail/456"
 *   label="Custom Product"
 *   search={{ tab: 'variants' }}
 * />
 *
 * @example
 * // Disabled state
 * <DetailPageButton
 *   id="789"
 *   label="Unavailable Item"
 *   disabled={true}
 * />
 *
 * @param {Object} props - Component props
 * @param {string|React.ReactNode} props.label - The text or content to display in the button
 * @param {string} [props.id] - The ID for relative navigation (creates href as `./${id}`)
 * @param {string} [props.href] - Custom href for navigation (takes precedence over id)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled (prevents navigation)
 * @param {Record<string, string>} [props.search] - Search parameters to include in the navigation
 *
 * @returns {React.ReactElement} A styled button component that navigates to detail pages
 *
 * @remarks
 * - Uses TanStack Router's Link component for client-side navigation
 * - Includes a chevron icon (hidden when disabled) to indicate navigation
 * - Preloading is disabled by default for performance optimization
 * - Styled as a ghost button variant for subtle, consistent appearance
 */
export function DetailPageButton({
    id,
    href,
    label,
    disabled,
    search,
}: {
    label: string | React.ReactNode;
    id?: string;
    href?: string;
    disabled?: boolean;
    search?: Record<string, string>;
}) {
    if (!id && !href) {
        return <span>{label}</span>;
    }
    return (
        <Button asChild variant="ghost" disabled={disabled}>
            <Link to={href ?? `./${id}`} search={search ?? {}} preload={false}>
                {label}
                {!disabled && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </Link>
        </Button>
    );
}
