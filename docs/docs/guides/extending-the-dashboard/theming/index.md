---
title: 'Dashboard Theming'
---

The Vendure dashboard uses a modern theming system based on **CSS custom properties** and **Tailwind CSS**. This guide shows you how to customize the colors and styles by modifying the theme variables in the Vite plugin.

## Overview

The dashboard theming system is built on:

- **CSS Custom Properties** - For dynamic theme switching and customization
- **Tailwind CSS** - For utility-first styling with `cssVariables: true`
- **Vite Plugin System** - For theme injection and processing

## Using Themes in Your Components

The Vendure dashboard provides a simple way to access theme variables in your components. Here's how to use them:

### Using Tailwind Classes

The easiest way to use theme colors is through Tailwind CSS classes:

```tsx
function ProductIdWidgetComponent() {
    return (
        <div className="text-sm">
            <p>
                This is a custom widget for the product:
                <strong className="ml-1 text-foreground">{product.name}</strong>
            </p>
            <p className="mt-2 text-muted-foreground">Product ID: {product.id}</p>
        </div>
    );
}
```

## Theme Variables Location

All theme variables are defined in `packages/dashboard/vite/vite-plugin-theme.ts`. This is where you can customize colors, typography, spacing, and border radius.

### Example: Changing Background Colors

```typescript
const defaultVariables: ThemeVariables = {
    light: {
        background: 'oklch(0.98 0.005 230)', // Ice blue background
        foreground: 'oklch(0.25 0.05 230)',  // Deep navy text
        card: 'oklch(0.99 0.003 230)',       // Very light ice blue cards
        // ... other variables
    },
    dark: {
        background: 'oklch(0.15 0.03 230)',  // Dark navy background
        foreground: 'oklch(0.92 0.01 230)',  // Light ice blue text
        card: 'oklch(0.18 0.04 230)',        // Slightly lighter navy cards
        // ... other variables
    }
};
```

## Available Theme Variables

The dashboard defines comprehensive theme variables that are automatically available as Tailwind classes:

### Core Colors

| Variable | Description | Light Theme | Dark Theme |
|----------|-------------|-------------|------------|
| `--background` | Main background | `oklch(0.98 0.005 300)` | `oklch(0.12 0.05 300)` |
| `--foreground` | Main text color | `oklch(0.25 0.08 300)` | `oklch(0.90 0.02 300)` |
| `--card` | Card background | `oklch(0.99 0.003 300)` | `oklch(0.18 0.04 300)` |
| `--card-foreground` | Card text | `oklch(0.25 0.08 300)` | `oklch(0.90 0.02 300)` |
| `--popover` | Popover background | `oklch(0.99 0.003 300)` | `oklch(0.18 0.04 300)` |
| `--popover-foreground` | Popover text | `oklch(0.25 0.08 300)` | `oklch(0.90 0.02 300)` |

### Interactive Colors

| Variable | Description | Light Theme | Dark Theme |
|----------|-------------|-------------|------------|
| `--primary` | Primary brand color | `oklch(0.50 0.18 300)` | `oklch(0.60 0.16 300)` |
| `--primary-foreground` | Text on primary | `oklch(0.95 0.01 300)` | `oklch(0.15 0.03 300)` |
| `--secondary` | Secondary actions | `oklch(0.92 0.03 300)` | `oklch(0.25 0.04 300)` |
| `--secondary-foreground` | Text on secondary | `oklch(0.30 0.05 300)` | `oklch(0.85 0.02 300)` |
| `--accent` | Accent elements | `oklch(0.92 0.03 300)` | `oklch(0.25 0.04 300)` |
| `--accent-foreground` | Text on accent | `oklch(0.30 0.05 300)` | `oklch(0.85 0.02 300)` |

### Semantic Colors

| Variable | Description | Light Theme | Dark Theme |
|----------|-------------|-------------|------------|
| `--destructive` | Error/danger actions | `oklch(0.65 0.20 25)` | `oklch(0.55 0.18 25)` |
| `--destructive-foreground` | Text on destructive | `oklch(0.95 0.01 300)` | `oklch(0.15 0.03 300)` |
| `--success` | Success states | `oklch(0.65 0.15 140)` | `oklch(0.55 0.12 140)` |
| `--success-foreground` | Text on success | `oklch(0.95 0.01 300)` | `oklch(0.15 0.03 300)` |
| `--muted` | Muted elements | `oklch(0.94 0.015 300)` | `oklch(0.22 0.03 300)` |
| `--muted-foreground` | Muted text | `oklch(0.55 0.03 300)` | `oklch(0.65 0.02 300)` |

### Border and Input Colors

| Variable | Description | Light Theme | Dark Theme |
|----------|-------------|-------------|------------|
| `--border` | Border color | `oklch(0.85 0.02 300)` | `oklch(0.30 0.03 300)` |
| `--input` | Input background | `oklch(0.99 0.003 300)` | `oklch(0.18 0.04 300)` |
| `--ring` | Focus ring color | `oklch(0.50 0.18 300)` | `oklch(0.60 0.16 300)` |

### Chart Colors

| Variable | Description | Light Theme | Dark Theme |
|----------|-------------|-------------|------------|
| `--chart-1` | Chart color 1 | `oklch(0.55 0.14 225)` | `oklch(0.65 0.12 225)` |
| `--chart-2` | Chart color 2 | `oklch(0.60 0.16 310)` | `oklch(0.70 0.14 310)` |
| `--chart-3` | Chart color 3 | `oklch(0.65 0.18 140)` | `oklch(0.75 0.16 140)` |
| `--chart-4` | Chart color 4 | `oklch(0.70 0.20 60)` | `oklch(0.80 0.18 60)` |
| `--chart-5` | Chart color 5 | `oklch(0.60 0.16 310)` | `oklch(0.70 0.14 310)` |

### Sidebar Colors

| Variable | Description | Light Theme | Dark Theme |
|----------|-------------|-------------|------------|
| `--sidebar` | Sidebar background | `oklch(0.96 0.01 300)` | `oklch(0.15 0.03 300)` |
| `--sidebar-foreground` | Sidebar text | `oklch(0.30 0.05 300)` | `oklch(0.85 0.02 300)` |
| `--sidebar-primary` | Sidebar primary | `oklch(0.50 0.18 300)` | `oklch(0.60 0.16 300)` |
| `--sidebar-primary-foreground` | Text on sidebar primary | `oklch(0.95 0.01 300)` | `oklch(0.15 0.03 300)` |
| `--sidebar-accent` | Sidebar accent | `oklch(0.90 0.02 300)` | `oklch(0.25 0.04 300)` |
| `--sidebar-accent-foreground` | Text on sidebar accent | `oklch(0.35 0.06 300)` | `oklch(0.80 0.02 300)` |
| `--sidebar-border` | Sidebar border | `oklch(0.88 0.02 300)` | `oklch(0.28 0.03 300)` |
| `--sidebar-ring` | Sidebar focus ring | `oklch(0.50 0.18 300)` | `oklch(0.60 0.16 300)` |

### Brand Colors

| Variable | Description | Value |
|----------|-------------|-------|
| `--brand` | Primary brand color | `#8b5cf6` |
| `--brand-lighter` | Lighter brand variant | `#a78bfa` |
| `--brand-darker` | Darker brand variant | `#7c3aed` |

| Variable | Description | Value |
|----------|-------------|-------|
| `dev-mode` | Dev-mode ring | `hsl(204, 76%, 62%)` |
| `dev-mode-foreground` | Dev-mode foreground | `hsl(0 0% 98%)` |

### Typography

| Variable | Description | Value |
|----------|-------------|-------|
| `--font-sans` | Sans-serif font | `Inter, system-ui, sans-serif` |
| `--font-mono` | Monospace font | `Geist Mono, monospace` |

### Border Radius

| Variable | Description | Value |
|----------|-------------|-------|
| `--radius` | Base border radius | `1rem` |
