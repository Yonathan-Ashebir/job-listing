# Job Listing Dashboard

A modern, responsive job listing dashboard built with React, TypeScript, and Tailwind CSS. This application displays job opportunities with filtering, sorting, and pagination capabilities.

This project is part of the **a2sv** program, a comprehensive software engineering training initiative.

## Features

- **Job Card Display**: Beautiful card-based layout showcasing job opportunities
- **Sorting**: Sort jobs by "Most relevant" or "Most recent"
- **Pagination**: Navigate through job listings with pagination controls
- **Responsive Design**: Fully responsive layout that works on all screen sizes
- **Type Safety**: Built with TypeScript for enhanced developer experience
- **Theme System**: Centralized theme configuration for colors, dimensions, fonts, and typography

## Design Implementation

This project was built by carefully copying and implementing a design from Figma. The following describes how the design was translated into code:

### Design Copy Process

#### Layout and Dimensions
- **Direct Copy**: All layout structures and dimensions were directly copied from the Figma design file
- **Precise Measurements**: Spacing, padding, margins, and sizes were extracted exactly as specified
- **Container Widths**: Maximum container widths for cards and dashboard were implemented as specified

#### Fonts
- **Google Fonts Import**: Fonts (Epilogue and Poppins) were imported from Google Fonts
- **Font Weights**: All font weights were applied as specified in the design
- **Typography Scale**: Font sizes, line heights, and letter spacing were matched exactly

#### Icons
- **Direct Copy**: SVG icons were directly copied from the design file
- **Iconly Integration**: The dropdown arrow icon uses the Iconly/Light/Arrow - Down 2 specification
- **Custom SVG**: Dot separator and other icons were implemented as inline SVG elements

#### Colors
- **Color Palette**: All colors were extracted and copied from the design
- **Color System**: Gray scale, primary colors, and opacity variants for hover states and overlays were implemented

#### Theme Refactoring
- **Centralized Theme**: All design parameters were refactored and organized under `src/theme/`:
  - `colors.ts`: All color values
  - `dimensions.ts`: Spacing, sizes, padding, heights, border radius
  - `fonts.ts`: Font families
  - `typography.ts`: Font weights, sizes, line heights, letter spacing
- **Maintainability**: This structure makes it easy to update design tokens across the entire application

#### Verification
- **Visual Comparison**: Final result's consistency was verified in multiple ways:
  - Side-by-side comparison with the design file
  - Pixel-perfect measurements
  - Color accuracy checks
  - Typography consistency validation

![Design Comparison](./dashboard-compare.png)

*Comparison between the Figma design (left) and the final implementation (right)*

## Additional Implementation Details

### Component Modularization
- **Reusable Components**: Parts of the page were modularized and split into different components:
  - `JobCard`: Individual job posting card
  - `Headline`: Header section with title, results count, and sort dropdown
  - `JobListingDashboard`: Main dashboard container
  - Internal components: `CompanyLogo`, `Tag` (unexported within JobCard)

### Responsive Implementation
- **Responsive Aware**: Some parameters were copied/implemented in a "responsive aware" manner:
  - Flexible container widths with max-width constraints
  - Flexbox layouts that adapt to different screen sizes
  - Wrapping behavior for tags and content

### Figma vs CSS Considerations
- **Border Differences**: Differences on how parameters work between Figma and actual CSS were considered:
  - Padding adjustments to account for border rendering differences
  - Border rendering differences handled appropriately

### Semantic HTML
- **Appropriate Tags**: Semantic HTML tags were used throughout:
  - `<h1>` for main headings
  - `<span>` for inline text elements
  - `<button>` for interactive elements
  - Proper alt text for images

### Logic Implementation
- **Sorting Options**: Implemented sorting by "Most relevant" (default order) and "Most recent" (by posted date)
- **Multi-Category Coloring**: Tags alternate colors (orange/purple) based on odd/even index
- **Pagination**: Full pagination system with Previous/Next buttons and page numbers
- **Location Detection**: Automatic detection of "Online" vs "In Person" based on location keywords

### UI Robustness
- **Extra Spacing**: Additional spaces and CSS attributes were added to make the UI more robust and responsive:
  - Proper gap spacing between elements
  - Hover states for interactive elements
  - Disabled states for pagination buttons
  - Error handling for missing images (fallback placeholders)

### Git Workflow
- **Branch Management**: Git branches are used to track different project phases and tasks.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev
```

### Build

```bash
# Build for production
npm run build
# or
pnpm build
```

### Preview

```bash
# Preview production build
npm run preview
# or
pnpm preview
```

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Google Fonts**: Epilogue and Poppins fonts

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

This project is created for educational purposes as part of the A2SV curriculum.

## Author

Created as part of the A2SV (Africa to Silicon Valley) program.
