# PDF Generation Issue Analysis

## Problem Summary
The right-side description panel is missing from the generated PDF. The PDF only contains the left-side deficiency list.

## Root Cause Analysis
Based on the description and common patterns in React PDF generation, the issue is caused by one of the following:

1.  **Ref Scope:** The `ref` used for `html2canvas` is attached to the left-side list container instead of a wrapper that contains *both* the list and the description panel.
2.  **DOM Structure:** The right-side panel is rendered outside the DOM hierarchy of the captured element (e.g., using React Portals or being a sibling to the captured container).
3.  **Styling/Positioning:** The right-side panel uses absolute positioning that places it outside the bounds of the captured container, or the container has `overflow: hidden` which clips the content during capture.

## Solution

To fix this, you need to:

1.  **Wrap both panels:** Ensure both the left list and the right description are children of a single parent container.
2.  **Move the Ref:** Attach the `ref` to this parent wrapper container.
3.  **Adjust Styles:** Ensure the wrapper container has appropriate dimensions to include both panels. Avoid `100vh` on the capture container if possible, or ensure `html2canvas` is configured with `windowHeight`.

## Code Example

### Before (Problematic)
The ref is only on the left panel, so the right panel is ignored.

```jsx
const leftPanelRef = useRef(null);

return (
  <div style={{ display: 'flex' }}>
    <div ref={leftPanelRef}> {/* Ref only here */}
      <ul>...</ul>
    </div>
    <div> {/* Right panel outside ref */}
      <Description />
    </div>
  </div>
);
```

### After (Fixed)
The ref is on the parent container, capturing both.

```jsx
const reportRef = useRef(null);

return (
  <div ref={reportRef} style={{ display: 'flex', flexDirection: 'row' }}> {/* Ref wraps both */}
    <div style={{ width: '50%' }}>
      <ul>...</ul>
    </div>
    <div style={{ width: '50%' }}>
      <Description />
    </div>
  </div>
);
```

## Best Practices for Multi-column PDF
- **Use Flexbox/Grid:** Standard CSS layout works best with `html2canvas`.
- **Avoid Portals:** If the description is in a modal/portal, render it inline for the PDF generation view, or create a specific "print view" component that renders everything inline.
- **Explicit Widths:** Set explicit widths (e.g., `width: 50%`) to ensure columns don't collapse.
- **Hide UI Elements:** use a class like `no-print` or conditional rendering to hide buttons/inputs during capture.

## Running the Reproduction
This repository contains a reproduction of the issue and the fix.
- `src/ProblemComponent.jsx`: Demonstrates the issue.
- `src/FixedComponent.jsx`: Demonstrates the fix.
