The numbered-manifesto / forecast feature tool — use when an issue's thesis is a list of declarations. Each proposition is a tomato number-ring + title + prose. Defaults to the ink stock.

```jsx
<ForecastSpread
  title="Six things that happen next"
  titleJp="次に起こる六つのこと"
  deck="The forward projection, with confidence."
  propositions={[
    { n: '01', title: 'Agents file their own field notes', body: ['The tool stops asking and starts logging.'] },
    { n: '02', title: 'The terminal becomes the cover', body: ['Quiet utility, loud frame.'] },
  ]}
  signoff="Filed against the next quarter."
  issue={{ number: '370', month: 'APRIL', year: '2026' }}
/>
```

Pass `accent="var(--pop-cobalt)"` for the cold-weather forecast register.
