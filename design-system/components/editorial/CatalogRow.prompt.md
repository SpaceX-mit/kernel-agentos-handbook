One numbered line of an editorial table of contents (001. · title · tag) — stack several inside a hairline-bordered list for an "In this issue" block.

```jsx
<div className="pop-toc">
  <CatalogRow n="001" en="Computer-use desktop agent" jp="デスクトップ制御" tag="FEATURE" tagVariant="tomato" />
  <CatalogRow n="002" en="Session isolation fix" jp="セッション分離" tag="SHIP" />
</div>
```

`tagVariant` defaults to `kraft`; use `tomato` for the headline item.
