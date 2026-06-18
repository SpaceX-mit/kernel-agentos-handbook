The graded-survey feature tool — use when an issue tests N things and commits to a verdict. A loud top-line verdict, a numbered rubric, then a grid of scored subject cards (score monument, stars, pros/cons, per-card verdict).

```jsx
<ReviewSpread
  title="Five terminals, one desk"
  titleJp="五つの端末、一つの机"
  verdict="If you only run one, run the quiet one."
  criteria={[
    { n: '01', label: 'Restraint', weight: '30%', description: 'Does it fill silence, or wait?' },
    { n: '02', label: 'Memory', weight: '40%' },
  ]}
  subjects={[
    { rank: 1, name: 'kbot', read: 'The quiet utility core', score: '9.2', stars: 5,
      pros: ['Keeps its own field notes', 'Never asks to break'], cons: ['Too modest to demo'],
      verdict: 'The one to keep.' },
  ]}
  signoff="Filed from the lab bench."
  issue={{ number: '378', month: 'APRIL', year: '2026' }}
/>
```
