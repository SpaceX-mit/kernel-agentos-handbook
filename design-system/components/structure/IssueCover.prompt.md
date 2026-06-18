The canonical issue cover — the print object. Reads paper stock + composition variant so every issue keeps its identity. Optional per-issue ornament and a wax press seal.

```jsx
<IssueCover
  issue={{ number: '371', month: 'APRIL', year: '2026', price: '¥0 · BYOK' }}
  headline={{ prefix: 'After', emphasis: 'Hours', suffix: 'in the Terminal', swash: 'A cinematographer profiles the night shift.' }}
  featureJp="深夜の端末、タングステンの記録"
  stock="ink" layout="asymmetric-left"
  ornament="flash-burn"
  seal={{ label: 'AFTER HOURS', date: 'IV·26' }}
/>
```

Layouts: `classic` (centred), `monument-hero` (the number is the art), `asymmetric-left` (flush-left), `ledger-rule` (graph-ruled audit). Ornaments: `ink-spread`, `warty-spots`, `flash-burn`.
