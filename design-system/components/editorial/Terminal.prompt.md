Mac-chrome terminal window on an ink ground with a hard tomato block shadow — the "quiet utility core" motif; use for field-report / kbot demos inside editorial layouts.

```jsx
<Terminal
  title="kbot — field report"
  lines={[
    { prompt: '$', text: 'kbot run synth' },
    { agent: '[coder]', text: 'building device pack…', dim: true },
    { prompt: '>', text: 'done. 9 devices shipped.' },
  ]}
/>
```

Pass structured `lines` ({ prompt, agent, text, dim }) or arbitrary `children`. `prompt` renders tomato, `agent` renders pool-blue, `dim` greys output lines.
