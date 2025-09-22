# Breadcrumb Component Documentation

## Overview
The breadcrumb component provides consistent navigation across all pages with a unified design system.

## Components

### PagesHistory (Core Component)
The main breadcrumb component with enhanced accessibility and modern design.

### BreadcrumbWrapper (Recommended)
A wrapper component that ensures consistent styling and spacing across different page types.

## Usage

### Basic Usage
```jsx
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";

<BreadcrumbWrapper 
  history={["/", "Current Page"]} 
  pageType="about"
  variant="clean"
/>
```

### With Navigation Paths
```jsx
const historyPaths = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" }
];

<BreadcrumbWrapper 
  history={["/", "Products", "iPhone 12"]} 
  historyPaths={historyPaths}
  pageType="productDetails"
  variant="clean"
/>
```

## Props

### BreadcrumbWrapper Props
- `history` (array): Array of page names for the breadcrumb trail
- `historyPaths` (array, optional): Array of navigation objects with path and label
- `pageType` (string): Page type for specific styling ("about", "contact", "products", "productDetails", "search")
- `variant` (string): Visual variant ("clean" or "wrapped")

### PagesHistory Props
- `history` (array): Array of page names
- `historyPaths` (array, optional): Navigation paths

## Page Types
- `about`: About page styling
- `contact`: Contact page styling  
- `products`: Products listing page styling
- `productDetails`: Product details page styling
- `search`: Search results page styling
- `default`: Default styling for other pages

## Variants
- `clean`: Minimal styling without background (recommended)
- `wrapped`: With background container and border

## Features
- ✅ Consistent design across all pages
- ✅ Responsive design for all screen sizes
- ✅ Accessibility compliant (ARIA labels, keyboard navigation)
- ✅ Dark theme support
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Modern chevron separators
- ✅ Hover and focus states
- ✅ Semantic HTML structure

## Design System
- Font: System font stack for optimal performance
- Colors: Consistent with design tokens
- Spacing: Standardized padding and margins
- Typography: Consistent font sizes and weights
- Icons: SVG chevron separators

## Accessibility
- Semantic `<nav>` element with proper ARIA labels
- Keyboard navigation support (Enter and Space keys)
- Screen reader friendly with `aria-current="page"`
- Focus indicators for keyboard users
- High contrast mode support

## Responsive Behavior
- Desktop: Full size with optimal spacing
- Tablet: Slightly reduced sizes and spacing
- Mobile: Compact design with smaller fonts and spacing

## Migration from Old Component
Replace old PagesHistory usage:
```jsx
// Old
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
<PagesHistory history={["/", "Page"]} />

// New
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";
<BreadcrumbWrapper history={["/", "Page"]} pageType="about" variant="clean" />
```