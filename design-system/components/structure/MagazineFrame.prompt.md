Wraps any inner page (Privacy, Security, a standalone feature) with the publication masthead strip + folio footer, so every route reads like a spread of the same issue.

```jsx
<MagazineFrame
  kicker="PRIVACY" title="What we keep" titleJp="プライバシー"
  page={7} deck="The short version: almost nothing."
  issue={{ number: '377', month: 'APRIL', year: '2026', tagline: 'MAGAZINE FOR CITY CODERS' }}
  onHome={() => goHome()}
>
  …page body…
</MagazineFrame>
```

Omit `title` for pages with their own hero. Pass `dark`/`stock="ink"` for dark inner pages (Security, Bench).
