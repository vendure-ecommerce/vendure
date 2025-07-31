---
title: 'Dashboard Theming'
---

The Vendure dashboard uses a modern theming system based on **CSS custom properties** and [Tailwind CSS](https://tailwindcss.com/) . This guide shows you how to customize the colors and styles by modifying the theme variables in the Vite plugin.

The dashboard also uses the same theming methodology as [shadcn/ui](https://ui.shadcn.com/docs/theming)

It also uses the [shadcn theme provider implementation](https://ui.shadcn.com/docs/dark-mode/vite) for Vite

## Using Themes in Your Components

The Vendure dashboard provides a simple way to access theme variables in your components. Here's how to use them:

### Using Tailwind Classes

The easiest way to use theme colors is through Tailwind variable CSS classes:

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

## Customizing Theme Colors

You can customize the dashboard theme colors by modifying the `theme` configuration in your `vite.config.mts` file. Here's an example showing how to change the primary brand colors:

```typescript
// vite.config.mts
import { vendureDashboardPlugin } from "@vendure/dashboard/plugin";
import { defineConfig } from "vite";
// ...other imports


export default defineConfig({
  plugins: [
    vendureDashboardPlugin({
      vendureConfigPath: "./src/vendure-config.ts",
      adminUiConfig: { apiHost: "http://localhost", apiPort: 3000 },
      gqlOutputPath: "./src/gql",

      // Theme section
      theme: {
        light: {
          // Change the primary brand color to blue
          primary: "oklch(0.55 0.18 240)",
          "primary-foreground": "oklch(0.98 0.01 240)",
          
          // Update the brand colors to match
          brand: "#2563eb", // Blue-600
          "brand-lighter": "#93c5fd", // Blue-300
        },
        dark: {
          // Corresponding dark mode colors
          primary: "oklch(0.65 0.16 240)",
          "primary-foreground": "oklch(0.12 0.03 240)",
          
          // Same brand colors work for both themes
          brand: "#2563eb",
          "brand-lighter": "#93c5fd",
        },
      },

    }),
  ],
});
```

## Inspecting element colors in the browser

To identify the exact color values used by dashboard elements, you can use your browser's developer tools:

- Right-click on any element and select "Inspect" to open the developer panel.
- Navigate to the **Styles** tab.
- From there, you can examine the CSS properties and see the actual color values (hex codes, RGB values, or CSS custom properties) being applied to that element.

![inspection-gif](show-colour-value-inspection.gif)

## Available Theme Variables

The dashboard defines comprehensive theme variables that are automatically available as Tailwind classes:

### Core Colors

| Variable | Description |
|----------|-------------|
| `--background` | Main background |
| `--foreground` | Main text color |
| `--card` | Card background |
| `--card-foreground` | Card text |
| `--popover` | Popover background |
| `--popover-foreground` | Popover text |

### Interactive Colors

| Variable | Description |
|----------|-------------|
| `--primary` | Primary brand color |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary actions |
| `--secondary-foreground` | Text on secondary |
| `--accent` | Accent elements |
| `--accent-foreground` | Text on accent |

### Semantic Colors

| Variable | Description |
|----------|-------------|
| `--destructive` | Error/danger actions |
| `--destructive-foreground` | Text on destructive |
| `--success` | Success states |
| `--success-foreground` | Text on success |
| `--muted` | Muted elements |
| `--muted-foreground` | Muted text |

### Border and Input Colors

| Variable | Description |
|----------|-------------|
| `--border` | Border color |
| `--input` | Input background |
| `--ring` | Focus ring color |

### Chart Colors

| Variable | Description |
|----------|-------------|
| `--chart-1` | Chart color 1 |
| `--chart-2` | Chart color 2 |
| `--chart-3` | Chart color 3 |
| `--chart-4` | Chart color 4 |
| `--chart-5` | Chart color 5 |

### Sidebar Colors

| Variable | Description |
|----------|-------------|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Sidebar primary |
| `--sidebar-primary-foreground` | Text on sidebar primary |
| `--sidebar-accent` | Sidebar accent |
| `--sidebar-accent-foreground` | Text on sidebar accent |
| `--sidebar-border` | Sidebar border |
| `--sidebar-ring` | Sidebar focus ring |

### Brand Colors

| Variable | Description |
|----------|-------------|
| `--brand` | Primary brand color |
| `--brand-lighter` | Lighter brand variant |
| `--brand-darker` | Darker brand variant |

| Variable | Description |
|----------|-------------|
| `dev-mode` | Dev-mode ring |
| `dev-mode-foreground` | Dev-mode foreground |

### Typography

| Variable | Description |
|----------|-------------|
| `--font-sans` | Sans-serif font |
| `--font-mono` | Monospace font |

### Border Radius

| Variable | Description |
|----------|-------------|
| `--radius` | Base border radius |
