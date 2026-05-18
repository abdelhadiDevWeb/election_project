# Diagnostic Report: Modal Display Issue

## Symptoms Observed
Based on the screenshot provided:
- The modal's background overlay (`bg-black/60`) is rendering successfully.
- The main modal content container is present but is collapsing into a thin vertical white line.
- The height of the modal seems to be constrained properly, but the `width` is evaluating to `0px` or `1px`.

## Root Cause Analysis
This is a classic CSS layout collapse issue related to Flexbox and Framer Motion interacting within a React Portal:
1. When the `Modal` is injected into `document.body` via `createPortal`, it sits outside the Next.js main flex layouts.
2. The modal wrapper is `fixed inset-0 flex items-center justify-center`.
3. The inner `motion.div` was using `w-full max-w-lg`. In certain Tailwind/Framer Motion setups, when a `motion.div` begins its `scale: 0.9` -> `1` animation inside a flex container, it loses its normal document flow width reference. As a result, `w-full` calculates against an undefined or 0-width context during the initial frame, causing it to snap to a 0px width.

## Action Taken
I have replaced the relative width sizing (`w-full max-w-lg`) with explicit, absolute width definitions:
- Replaced: `w-full max-w-lg`
- With: `w-[95vw] sm:w-[512px] max-w-full`

This forces the modal to take up 95% of the viewport width on mobile, and exactly `512px` on larger screens. Because the width is now explicitly defined in the CSS, it cannot collapse to zero regardless of the Flexbox context or animation state.

## Next Steps
1. The fix has been applied to `app/(dashboard)/components/Modal.tsx`.
2. Please test the modals on any of the pages (e.g., Access Management, Political Entities) to confirm they now expand and display their content correctly.
3. If the issue persists, the next step would be to temporarily disable `AnimatePresence` to isolate if Framer Motion's `layoutId` or `scale` is forcefully applying inline styles that override Tailwind.
