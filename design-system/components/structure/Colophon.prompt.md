The magazine's shared footer — wordmark + tagline, issue monument, discovery links, sign-off. Place at the foot of any surface.

```jsx
<Colophon
  issue={{ number: '377', month: 'APRIL', year: '2026' }}
  links={[{ label: 'Back Issues', href: '#/issues' }, { label: 'Privacy', href: '#/privacy' }]}
  signoff="MIT · kernel.chat group · Published monthly."
/>
```

Defaults supply the standard tagline + link row; override `links` per surface.
