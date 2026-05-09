# ANIE Electoral Management System - Full Design & Architecture Diagnostic

This document provides a comprehensive technical and aesthetic breakdown of the project, covering the architecture, design system, component logic, and development workflow.

---

## 1. Technical Stack & Architecture
The application is built using a modern, high-performance web stack optimized for rapid interaction and visual fidelity.

*   **Core Framework**: Next.js 15+ (App Router) using TypeScript for type safety.
*   **Styling Engine**: 
    *   **Tailwind CSS v4**: Utilized for rapid layout and utility-first styling.
    *   **Global CSS Overrides**: Custom logic in `globals.css` to enforce the "Ultra-Dark" monochromatic theme via `!important` flags.
*   **State Management**: 
    *   **DataContext.tsx**: A centralized React Context provider managing all infrastructure and personnel data.
    *   **LocalStorage Persistence**: (Currently volatile, planned for Supabase/Postgres integration).
*   **Motion & UX**: **Framer Motion** for smooth page transitions, modal entries, and tab-switching animations.
*   **Data Processing**: **SheetJS (XLSX)** for importing and exporting administrative hierarchy data.

---

## 2. Design System: "Ultra-Dark Monochromatic"
The project follows a premium "OLED-Black" aesthetic designed for high-stakes administrative environments.

### Color Palette
*   **Primary Background**: `#000000` (Pure Black) - Reduces eye strain and provides maximum contrast.
*   **Structural Background**: `#09090b` (Zinc-950) - Used for cards, table headers, and sidebar containers.
*   **Branding**: `#006233` (Algerian Green) - Used for primary actions, success states, and active indicators.
*   **Secondary/Labels**: `#d4d4d8` (Zinc-300) - For secondary text and muted labels.
*   **Borders**: `#27272a` (Zinc-800) - Subtle separation for glassmorphism effects.

### Typography & Icons
*   **Font**: **Inter** (Variable) - Selected for its exceptional readability in data-heavy tables.
*   **Icons**: **Lucide-React** - A consistent, thin-stroke icon set used throughout the navigation and metrics.

### Visual Effects
*   **Glassmorphism**: Components use the `.glass` class, featuring `backdrop-filter: blur(12px)` and semi-transparent backgrounds to create depth.
*   **Monochromatic Badges**: Status indicators (ACTIF, EXPIRE) use a darkened, low-opacity version of their respective colors to avoid "visual noise" while maintaining clarity.

---

## 3. Component Architecture
The UI is modular, relying on high-level components that adapt to the dark theme.

### DataTable.tsx
*   **Logic**: Handles pagination (10 rows per page), searching, and multi-column rendering.
*   **Styling**: Forced Zinc-950 header and pure black footer. Includes a semantic `.pagination-footer` class for theme consistency.

### Modal.tsx
*   **Logic**: Controlled via local state in each page; uses a standard overlay with Framer Motion animations.
*   **Layout**: Scrollable content areas (max-height 70vh) to ensure usability on smaller screens.

### StatCard.tsx
*   **Logic**: Dynamically displays metrics with glass effects.
*   **Workflow**: Integrated with `DataContext` to show real-time totals (e.g., Total Inscrits, Total Centers).

---

## 4. Data Hierarchy & Workflow
The system is built around a four-tier hierarchical infrastructure designed to manage national-level elections.

### Administrative Workflow
1.  **Wilaya**: The top-level administrative unit (Code, Name, Seats).
2.  **Commune (Baladia)**: Belong to a Wilaya; contains multiple voting centers.
3.  **Centre de Vote**: Physical locations where citizens vote; manages gender-based voter distributions.
4.  **Bureau de Vote (Desk)**: The final unit where the actual vote occurs and PVs are generated.

### Personnel & Role Workflow
*   **Access Management**: Role-Based Access Control (RBAC) ranging from Super Admin to Baladia-level administrators.
*   **Temporary Personnel**: Observateurs and station staff assigned to specific Centers/Desks with temporary access codes (`TMP-XXX-X`).

### Validation (PV) Workflow
*   **OCR Integration**: The system provides a side-by-side view for manual validation of scanned Procès-Verbaux against OCR-extracted data.
*   **Confidence Scoring**: Visual indicators show OCR accuracy, allowing admins to flag "mismatches."

---

## 5. Dashboard Design Strategy
The Overview page acts as the "Nerve Center" of the operation.

*   **Bento Grid Layout**: Metrics are organized in a non-linear, high-density grid for quick scanning.
*   **Navigation Tabs with Counters**: Every module (Infrastructure, Access, Entities) features tabs that display the total number of items, providing instant feedback on the data volume.
*   **Interactive Metrics**: Hover effects and smooth transitions ensure the interface feels "alive" and responsive to user input.

---

## 6. Key Logic Patterns
*   **Cascading Selects**: In forms, selecting a Wilaya automatically filters the available Communes, ensuring data integrity.
*   **Ultra-Dark Overrides**: The system uses global CSS to intercept Tailwind's standard gray/white classes and force them into the Zinc-950/Black range, ensuring third-party or future components automatically comply with the theme.

---
*Diagnostic generated on 2026-05-09*
