The Q&A profile feature tool — use when an issue is carried by a subject (a person, real or composite). A dossier card sets up the subject, then alternating questions and answers; the last answer drop-caps.

```jsx
<InterviewSpread
  title="The night shift"
  titleJp="夜勤"
  deck="A cinematographer who shoots in the dark."
  byline="Interview · THE EDITORS"
  subject={{ name: 'A. Mori', role: 'Cinematographer', location: 'Setagaya, Tokyo' }}
  exchanges={[
    { q: 'Why tungsten?', a: 'Because the screen is the only thing that has to be sharp.' },
    { q: 'And the Kernel?', a: 'The only crew member who never asks to break.' },
  ]}
  signoff="Filed at 4am, between setups."
  issue={{ number: '371', month: 'APRIL', year: '2026' }}
/>
```
