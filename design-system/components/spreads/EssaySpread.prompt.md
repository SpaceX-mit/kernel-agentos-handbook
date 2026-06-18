The long-form prose essay feature tool — the most-used spread. Use when the issue is carried by writing. Sectioned prose with a drop-capped lead, a tomato pull-quote after the second section, optional numbered references, and a sign-off.

```jsx
<EssaySpread
  title="A day with the desktop agent" titleJp="デスクトップ・エージェントと過ごす一日"
  deck="We gave the Kernel a mouse and a Tuesday." byline="THE EDITORS · 1,500 words"
  sections={[
    { heading: 'EIGHT O\u2019CLOCK', headingJp: '朝八時', paragraphs: ['The agent opens before the coffee…', '…'] },
    { heading: 'THE RESTRAINT', headingJp: '抑制', paragraphs: ['A lesser tool fills every silence…'] },
  ]}
  pullQuote={{ text: 'It kept its own field notes.', attribution: '— FIELD REPORT' }}
  references={{ items: [{ authors: 'Anthropic', year: '2026', title: 'Computer use', journal: 'arXiv' }] }}
  signoff="Filed from a fifth-floor walk-up, with the window open."
  issue={{ number: '376', month: 'APRIL', year: '2026' }}
/>
```
