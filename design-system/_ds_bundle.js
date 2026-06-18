/* @ds-bundle: {"format":3,"namespace":"KernelChatDesignSystem_52d084","components":[{"name":"Banner","sourcePath":"components/editorial/Banner.jsx"},{"name":"CatalogRow","sourcePath":"components/editorial/CatalogRow.jsx"},{"name":"Kicker","sourcePath":"components/editorial/Kicker.jsx"},{"name":"Monument","sourcePath":"components/editorial/Monument.jsx"},{"name":"Terminal","sourcePath":"components/editorial/Terminal.jsx"},{"name":"KernelLoading","sourcePath":"components/motion/KernelLoading.jsx"},{"name":"PopIcon","sourcePath":"components/ornaments/PopIcon.jsx"},{"name":"PopPathText","sourcePath":"components/ornaments/PopPathText.jsx"},{"name":"PopShape","sourcePath":"components/ornaments/PopShape.jsx"},{"name":"DispatchSpread","sourcePath":"components/spreads/DispatchSpread.jsx"},{"name":"EssaySpread","sourcePath":"components/spreads/EssaySpread.jsx"},{"name":"ForecastSpread","sourcePath":"components/spreads/ForecastSpread.jsx"},{"name":"InterviewSpread","sourcePath":"components/spreads/InterviewSpread.jsx"},{"name":"ReviewSpread","sourcePath":"components/spreads/ReviewSpread.jsx"},{"name":"Colophon","sourcePath":"components/structure/Colophon.jsx"},{"name":"IssueCover","sourcePath":"components/structure/IssueCover.jsx"},{"name":"MagazineFrame","sourcePath":"components/structure/MagazineFrame.jsx"}],"sourceHashes":{"components/editorial/Banner.jsx":"13d78ce786ee","components/editorial/CatalogRow.jsx":"13dc8a501b30","components/editorial/Kicker.jsx":"66b7388a0a5e","components/editorial/Monument.jsx":"e3abf9c4b5a4","components/editorial/Terminal.jsx":"4106b592ed9d","components/motion/KernelLoading.jsx":"3a96f6b9c202","components/ornaments/PopIcon.jsx":"c5560c5def89","components/ornaments/PopPathText.jsx":"8cf2caf70a6f","components/ornaments/PopShape.jsx":"49201878d925","components/spreads/DispatchSpread.jsx":"c897139c563e","components/spreads/EssaySpread.jsx":"76221d2d1546","components/spreads/ForecastSpread.jsx":"f1ae789c3b27","components/spreads/InterviewSpread.jsx":"4f4b4deca703","components/spreads/ReviewSpread.jsx":"acbce5893ac7","components/structure/Colophon.jsx":"46c5212fd8c6","components/structure/IssueCover.jsx":"815e01379b41","components/structure/MagazineFrame.jsx":"fe0b63cd929b","ui_kits/archive/Archive.jsx":"e3954bd39584","ui_kits/inner-page/LegalPage.jsx":"021dde031016","ui_kits/magazine/MagazineIssue.jsx":"e103844980cf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KernelChatDesignSystem_52d084 = window.KernelChatDesignSystem_52d084 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/editorial/Banner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Banner — a reversed tag box, feature-flag style. The tomato
 * default is the loudest small element in the system; ink and kraft
 * variants tag sections more quietly. Courier Prime, uppercase.
 */
function Banner({
  children,
  variant = 'tomato',
  className = '',
  ...rest
}) {
  const classes = ['pop-banner', variant === 'ink' ? 'pop-banner--ink' : '', variant === 'kraft' ? 'pop-banner--kraft' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, rest), children);
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/Banner.jsx", error: String((e && e.message) || e) }); }

// components/editorial/CatalogRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CatalogRow — one numbered line of an editorial table of contents:
 * 001. · title (with JP subtitle) · section tag. A grid of these,
 * hairline-separated, is the magazine's "In this issue" list.
 */
function CatalogRow({
  n,
  en,
  jp,
  tag,
  tagVariant = 'kraft',
  className = '',
  ...rest
}) {
  const classes = ['pop-row', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classes
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "pop-catalog-num"
  }, n, "."), /*#__PURE__*/React.createElement("span", {
    className: "pop-row-label"
  }, en, jp && /*#__PURE__*/React.createElement("span", {
    className: "pop-row-sub"
  }, jp)), tag && /*#__PURE__*/React.createElement(__ds_scope.Banner, {
    variant: tagVariant
  }, tag));
}
Object.assign(__ds_scope, { CatalogRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/CatalogRow.jsx", error: String((e && e.message) || e) }); }

// components/editorial/Kicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kicker — the bracketed mono category label that heads every
 * editorial section: [ CATEGORY · 日本語 ]. Courier Prime, uppercase,
 * wide tracking. The brackets are drawn by CSS.
 */
function Kicker({
  children,
  jp,
  tomato = false,
  className = '',
  ...rest
}) {
  const label = jp ? `${children} · ${jp}` : children;
  const classes = ['pop-kicker', tomato ? 'pop-kicker--tomato' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, rest), label);
}
Object.assign(__ds_scope, { Kicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/Kicker.jsx", error: String((e && e.message) || e) }); }

// components/editorial/Monument.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Monument — the stacked issue-number corner block. The big tomato
 * numeral is the cover's serial anchor; the mono lines above and
 * below give it dateline + price context. Used bottom-right of every
 * cover and in the colophon.
 */
function Monument({
  number,
  month,
  year,
  price,
  className = '',
  ...rest
}) {
  const classes = ['pop-monument', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classes
  }, rest), /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, number), (month || year) && /*#__PURE__*/React.createElement("span", null, [month, year].filter(Boolean).join(' ')), price && /*#__PURE__*/React.createElement("span", null, price));
}
Object.assign(__ds_scope, { Monument });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/Monument.jsx", error: String((e && e.message) || e) }); }

// components/editorial/Terminal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Terminal — the magazine's mac-chrome terminal window, an ink
 * ground with a hard tomato offset-block shadow. Pass `title` for the
 * window-bar label and an array of `lines` ({ prompt, text, agent,
 * dim }) for the body, or arbitrary children. The quiet utility core
 * inside the loud editorial frame.
 */
function Terminal({
  title = 'kbot — kernel.chat',
  lines,
  children,
  className = '',
  ...rest
}) {
  const classes = ['pop-terminal', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classes
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-terminal-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-term-dot pop-term-dot--red"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pop-term-dot pop-term-dot--yellow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pop-term-dot pop-term-dot--green"
  }), title && /*#__PURE__*/React.createElement("span", {
    className: "pop-terminal-title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "pop-terminal-body"
  }, lines ? lines.map((line, i) => /*#__PURE__*/React.createElement("div", {
    className: "pop-terminal-line",
    key: i
  }, line.prompt && /*#__PURE__*/React.createElement("span", {
    className: "pop-terminal-prompt"
  }, line.prompt), line.agent && /*#__PURE__*/React.createElement("span", {
    className: "pop-terminal-agent"
  }, line.agent, " "), /*#__PURE__*/React.createElement("span", {
    className: line.dim ? 'pop-terminal-dim' : undefined
  }, line.text))) : children));
}
Object.assign(__ds_scope, { Terminal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/Terminal.jsx", error: String((e && e.message) || e) }); }

// components/motion/KernelLoading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * KernelLoading — the "ink on paper" loading constellation. Four sepia
 * ink-drops on a square; the whole field drifts slowly (ink diffusing
 * in water) while each drop trembles fast (surface tension), and the
 * connecting threads breathe at a third rhythm. CSS-only, gated on
 * prefers-reduced-motion. The brand's signature loader.
 *
 * Optional `label` shows a mono caption beneath. `size` scales the
 * 120px constellation.
 */
function KernelLoading({
  size = 120,
  label,
  className = '',
  style,
  ...rest
}) {
  const scale = size / 120;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['pop-loading', className].filter(Boolean).join(' '),
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18,
      ...style
    },
    role: "status",
    "aria-label": label || 'Loading'
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-constellation",
    style: {
      width: 120,
      height: 120,
      transform: scale !== 1 ? `scale(${scale})` : undefined
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "pop-constellation-thread",
    viewBox: "0 0 120 120",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "30",
    y1: "30",
    x2: "90",
    y2: "30"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "90",
    y1: "30",
    x2: "90",
    y2: "90"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "90",
    y1: "90",
    x2: "30",
    y2: "90"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "30",
    y1: "90",
    x2: "30",
    y2: "30"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pop-constellation-drop"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pop-constellation-drop"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pop-constellation-drop"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pop-constellation-drop"
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "pop-folio",
    style: {
      fontSize: 11,
      letterSpacing: '0.14em',
      opacity: 0.6
    }
  }, label));
}
Object.assign(__ds_scope, { KernelLoading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motion/KernelLoading.jsx", error: String((e && e.message) || e) }); }

// components/ornaments/PopIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PopIcon — the editorial pictogram primitive. Hand-tuned inline SVGs
 * with a slightly thicker editorial stroke (1.75px) — deliberately
 * NOT Feather/Lucide; they speak the magazine's type weight. Takes
 * currentColor. Use sparingly as section markers / sign-offs.
 *
 * The `asterisk` is the magazine's single recurring system glyph
 * (every folio strip). The rest are single-use editorial accents.
 */
function IconBody({
  name
}) {
  const s = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (name) {
    case 'arrow':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", _extends({
        x1: "3",
        y1: "12",
        x2: "20",
        y2: "12"
      }, s)), /*#__PURE__*/React.createElement("polyline", _extends({
        points: "14 6 20 12 14 18"
      }, s)));
    case 'asterisk':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", _extends({
        x1: "12",
        y1: "3",
        x2: "12",
        y2: "21"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "4.1",
        y1: "7.5",
        x2: "19.9",
        y2: "16.5"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "4.1",
        y1: "16.5",
        x2: "19.9",
        y2: "7.5"
      }, s)));
    case 'sparkle':
      return /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M12 3 L13.3 10.7 L21 12 L13.3 13.3 L12 21 L10.7 13.3 L3 12 L10.7 10.7 Z"
      }));
    case 'leaf':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M4 20 C4 10, 14 4, 20 4 C20 14, 14 20, 4 20 Z"
      })), /*#__PURE__*/React.createElement("line", _extends({
        x1: "5",
        y1: "19",
        x2: "14",
        y2: "10"
      }, s)));
    case 'coffee':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M5 9 H17 V16 C17 18.2 15.2 20 13 20 H9 C6.8 20 5 18.2 5 16 Z"
      })), /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M17 11 H19 C20.1 11 21 11.9 21 13 C21 14.1 20.1 15 19 15 H17"
      })), /*#__PURE__*/React.createElement("line", _extends({
        x1: "8",
        y1: "3",
        x2: "8",
        y2: "6"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "12",
        y1: "3",
        x2: "12",
        y2: "6"
      }, s)));
    case 'sun':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "4"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "12",
        y1: "2",
        x2: "12",
        y2: "4"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "12",
        y1: "20",
        x2: "12",
        y2: "22"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "2",
        y1: "12",
        x2: "4",
        y2: "12"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "20",
        y1: "12",
        x2: "22",
        y2: "12"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "4.9",
        y1: "4.9",
        x2: "6.3",
        y2: "6.3"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "17.7",
        y1: "17.7",
        x2: "19.1",
        y2: "19.1"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "4.9",
        y1: "19.1",
        x2: "6.3",
        y2: "17.7"
      }, s)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "17.7",
        y1: "6.3",
        x2: "19.1",
        y2: "4.9"
      }, s)));
    case 'moon':
      return /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M20 14.5 A8 8 0 1 1 9.5 4 A6 6 0 0 0 20 14.5 Z"
      }));
    case 'book':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M4 4 H11 C12.1 4 13 4.9 13 6 V21 L11 19 H4 Z"
      })), /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M20 4 H13 C11.9 4 11 4.9 11 6 V21 L13 19 H20 Z"
      })));
    case 'pin':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M12 2 C8.7 2 6 4.7 6 8 C6 13 12 22 12 22 C12 22 18 13 18 8 C18 4.7 15.3 2 12 2 Z"
      })), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "8",
        r: "2.5"
      }, s)));
    case 'quote':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M6 17 C6 13 9 11 10 11 L10 8 C7 8 4 10 4 14 V17 Z"
      })), /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M16 17 C16 13 19 11 20 11 L20 8 C17 8 14 10 14 14 V17 Z"
      })));
    case 'thread':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "5",
        r: "1.4",
        fill: "currentColor",
        stroke: "none"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1.4",
        fill: "currentColor",
        stroke: "none"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "19",
        r: "1.4",
        fill: "currentColor",
        stroke: "none"
      }));
    case 'pilcrow':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({}, s, {
        d: "M16 3 H10 C7.8 3 6 4.8 6 7 C6 9.2 7.8 11 10 11 H11 V21"
      })), /*#__PURE__*/React.createElement("line", _extends({
        x1: "15",
        y1: "3",
        x2: "15",
        y2: "21"
      }, s)));
    default:
      return null;
  }
}
function PopIcon({
  name,
  size = 'md',
  color,
  className = '',
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const classes = ['pop-icon', `pop-icon--${name}`, `pop-icon--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes,
    style: color ? {
      color,
      ...style
    } : style,
    role: ariaLabel ? 'img' : 'presentation',
    "aria-label": ariaLabel
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "pop-icon-svg",
    "aria-hidden": !ariaLabel,
    focusable: "false"
  }, /*#__PURE__*/React.createElement(IconBody, {
    name: name
  })));
}
Object.assign(__ds_scope, { PopIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ornaments/PopIcon.jsx", error: String((e && e.message) || e) }); }

// components/ornaments/PopPathText.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PRESETS = {
  'arc-top': 'M 30 100 Q 200 10, 370 100',
  'arc-bottom': 'M 30 20 Q 200 110, 370 20',
  'wave': 'M 10 60 Q 110 10, 200 60 T 390 60'
};
let _pid = 0;

/**
 * PopPathText — writing along a path. An SVG <textPath> primitive for
 * curved / arched headlines, set in italic EB Garamond. Three presets
 * (arc-top, arc-bottom, wave) or a custom `d` in the 0 0 400 120 box.
 * Use for cover ornaments, section transitions, sign-offs — never body.
 */
function PopPathText({
  text,
  preset = 'arc-top',
  d,
  fontSize = 22,
  color = 'tomato',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...rest
}) {
  const pathD = d || PRESETS[preset] || PRESETS['arc-top'];
  const pathId = React.useMemo(() => `pop-path-${_pid += 1}`, []);
  const classes = ['pop-path-text', `pop-path-text--${size}`, `pop-path-text--${color}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes,
    role: "img",
    "aria-label": ariaLabel || text
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 120",
    className: "pop-path-text-svg",
    "aria-hidden": "true",
    focusable: "false"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
    id: pathId,
    d: pathD,
    fill: "none"
  })), /*#__PURE__*/React.createElement("text", {
    className: "pop-path-text-label",
    fontSize: fontSize
  }, /*#__PURE__*/React.createElement("textPath", {
    href: `#${pathId}`,
    startOffset: "50%",
    textAnchor: "middle"
  }, text))));
}
Object.assign(__ds_scope, { PopPathText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ornaments/PopPathText.jsx", error: String((e && e.message) || e) }); }

// components/ornaments/PopShape.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PopShape — the geometric ornament primitive (the "Illustrator
 * layer"). A small tokenized mark — circle, ring, dot, square,
 * lozenge, triangle, star, slash — rendered as inline SVG that takes
 * currentColor. Optional centered mono `label` makes it an editorial
 * badge. Use sparingly: ornament, not UI chrome.
 */
function ShapePath({
  name
}) {
  switch (name) {
    case 'circle':
      return /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "11",
        fill: "currentColor"
      });
    case 'ring':
      return /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10.5",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5"
      });
    case 'dot':
      return /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "5",
        fill: "currentColor"
      });
    case 'square':
      return /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "2",
        width: "20",
        height: "20",
        fill: "currentColor"
      });
    case 'lozenge':
      return /*#__PURE__*/React.createElement("polygon", {
        points: "12,1 23,12 12,23 1,12",
        fill: "currentColor"
      });
    case 'triangle':
      return /*#__PURE__*/React.createElement("polygon", {
        points: "12,2 22,21 2,21",
        fill: "currentColor"
      });
    case 'star':
      return /*#__PURE__*/React.createElement("polygon", {
        points: "12,1 14.9,8.6 23,9.2 16.8,14.4 18.9,22.2 12,17.8 5.1,22.2 7.2,14.4 1,9.2 9.1,8.6",
        fill: "currentColor"
      });
    case 'slash':
      return /*#__PURE__*/React.createElement("line", {
        x1: "2",
        y1: "22",
        x2: "22",
        y2: "2",
        stroke: "currentColor",
        strokeWidth: "2"
      });
    default:
      return null;
  }
}
function PopShape({
  name,
  size = 'md',
  color = 'tomato',
  label,
  className = '',
  ...rest
}) {
  const classes = ['pop-shape', `pop-shape--${name}`, `pop-shape--${size}`, `pop-shape--${color}`, label ? 'pop-shape--has-label' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "pop-shape-svg",
    "aria-hidden": "true",
    focusable: "false"
  }, /*#__PURE__*/React.createElement(ShapePath, {
    name: name
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "pop-shape-label"
  }, label));
}
Object.assign(__ds_scope, { PopShape });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ornaments/PopShape.jsx", error: String((e && e.message) || e) }); }

// components/spreads/DispatchSpread.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DispatchSpread — the wire-style news dispatch feature tool. Reactive,
 * filed-the-night-of grammar borrowed from the newswire: a repeating
 * Courier slug marquee, a newspaper dateline, a rotated gummed dossier
 * card (STATUS stamp + FILED/ISSUE fields), checkbox-numbered
 * propositions, an optional mid-spread BULLETIN, and a "— 30 —"
 * terminator. Used when an issue reacts to a specific event.
 */
function DispatchSpread({
  slug = 'WIRE · DISPATCH · 速報',
  kicker = 'DISPATCH · 速報',
  title,
  titleJp,
  deck,
  dateline,
  byline,
  status = 'FILED',
  filedAt,
  propositions = [],
  bulletin,
  terminator,
  signoff,
  issue = {},
  stock = 'ivory',
  className = '',
  ...rest
}) {
  const splitAt = Math.min(3, propositions.length);
  const first = propositions.slice(0, splitAt);
  const second = propositions.slice(splitAt);
  const Item = ({
    p
  }) => /*#__PURE__*/React.createElement("li", {
    className: "pop-dp-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-dp-item-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-check"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "42",
    height: "42",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 11 26 Q 15 29 20 34 Q 26 26 38 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-check-num"
  }, p.n)), /*#__PURE__*/React.createElement("div", null, p.overline && /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-item-overline"
  }, p.overline, " \xB7 ", p.n), /*#__PURE__*/React.createElement("h3", {
    className: "pop-dp-item-title"
  }, p.title))), /*#__PURE__*/React.createElement("div", {
    className: "pop-dp-item-body"
  }, (p.body || []).map((para, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, para))));
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['pop-spread', `pop-stock-${stock}`, className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-dp-slug"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-dp-slug-track"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-slug-text"
  }, slug), /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-slug-dot"
  }, "\u25CF"))))), /*#__PURE__*/React.createElement("div", {
    className: "pop-spread-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pop-spread-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, kicker), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-spread-title"
  }, title), titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, titleJp), deck && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-deck"
  }, deck), dateline && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-dp-dateline"
  }, dateline), byline && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-spread-byline"
  }, byline)), /*#__PURE__*/React.createElement("aside", {
    className: "pop-dp-dossier"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-dp-stamp"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-stamp-label"
  }, "STATUS"), /*#__PURE__*/React.createElement("strong", null, status)), /*#__PURE__*/React.createElement("dl", {
    className: "pop-dp-fields"
  }, filedAt && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "FILED"), /*#__PURE__*/React.createElement("dd", null, filedAt)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "ISSUE"), /*#__PURE__*/React.createElement("dd", null, issue.number, " \xB7 ", [issue.month, issue.year].filter(Boolean).join(' '))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "BYLINE"), /*#__PURE__*/React.createElement("dd", null, "THE EDITORS")))), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--tomato pop-spread-divider"
  }), /*#__PURE__*/React.createElement("ol", {
    className: "pop-dp-list"
  }, first.map(p => /*#__PURE__*/React.createElement(Item, {
    key: p.n,
    p: p
  }))), bulletin && /*#__PURE__*/React.createElement("figure", {
    className: "pop-dp-bulletin"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-bulletin-label"
  }, "\u2014 BULLETIN \u2014"), /*#__PURE__*/React.createElement("blockquote", {
    className: "pop-dp-bulletin-text"
  }, "\u2014 ", bulletin, " \u2014")), second.length > 0 && /*#__PURE__*/React.createElement("ol", {
    className: "pop-dp-list"
  }, second.map(p => /*#__PURE__*/React.createElement(Item, {
    key: p.n,
    p: p
  }))), /*#__PURE__*/React.createElement("footer", {
    className: "pop-spread-signoff"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), signoff && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-signoff-text"
  }, signoff), /*#__PURE__*/React.createElement("div", {
    className: "pop-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, [issue.month, issue.year].filter(Boolean).join(' '))))), terminator && /*#__PURE__*/React.createElement("div", {
    className: "pop-dp-terminator"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-terminator-mark"
  }, "\u2014 30 \u2014"), /*#__PURE__*/React.createElement("span", {
    className: "pop-dp-terminator-text"
  }, terminator)));
}
Object.assign(__ds_scope, { DispatchSpread });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/spreads/DispatchSpread.jsx", error: String((e && e.message) || e) }); }

// components/spreads/EssaySpread.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * EssaySpread — the long-form prose feature tool (editorial tool #1).
 * Used when the issue is carried by writing. Kicker + title + italic
 * standfirst + byline, sectioned prose with a drop cap on the lead
 * paragraph, a tomato pull-quote dropped after the second section, an
 * optional works-cited block, and a sign-off. No images.
 */
function EssaySpread({
  kicker = 'ESSAY · 随筆',
  title,
  titleJp,
  deck,
  byline,
  sections = [],
  pullQuote,
  references,
  signoff,
  issue = {},
  stock = 'kraft',
  className = '',
  ...rest
}) {
  const onInk = stock === 'ink';
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['pop-spread', `pop-stock-${stock}`, onInk ? 'pop-spread-on-ink' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-spread-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pop-spread-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, kicker), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-spread-title"
  }, title), titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, titleJp), deck && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-deck"
  }, deck), byline && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-spread-byline"
  }, byline)), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-spread-divider"
  }), /*#__PURE__*/React.createElement("article", {
    className: "pop-es-body"
  }, sections.map((section, sIdx) => /*#__PURE__*/React.createElement("div", {
    className: "pop-es-section",
    key: sIdx
  }, section.heading && /*#__PURE__*/React.createElement("h3", {
    className: "pop-es-section-head"
  }, /*#__PURE__*/React.createElement("span", null, section.heading), section.headingJp && /*#__PURE__*/React.createElement("span", {
    className: "pop-es-section-head-jp"
  }, "\xB7 ", section.headingJp)), (section.paragraphs || []).map((para, pIdx) => {
    const isLead = sIdx === 0 && pIdx === 0;
    return /*#__PURE__*/React.createElement("p", {
      key: pIdx,
      className: `pop-es-para${isLead ? ' pop-es-para--lead' : ''}`
    }, para);
  }), sIdx === 1 && pullQuote && /*#__PURE__*/React.createElement("aside", {
    className: "pop-es-pullquote"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pop-es-pullquote-text"
  }, "\u201C", pullQuote.text, "\u201D"), pullQuote.attribution && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-es-pullquote-attr"
  }, pullQuote.attribution))))), references && references.items && references.items.length > 0 && /*#__PURE__*/React.createElement("aside", {
    className: "pop-es-refs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, references.kicker || 'WORKS CITED · 引用'), /*#__PURE__*/React.createElement("ol", {
    className: "pop-es-refs-list"
  }, references.items.map((ref, i) => /*#__PURE__*/React.createElement("li", {
    className: "pop-es-refs-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-es-refs-n"
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", null, ref.authors, " "), ref.year && /*#__PURE__*/React.createElement("span", null, "(", ref.year, "). "), /*#__PURE__*/React.createElement("span", {
    className: "pop-es-refs-title"
  }, ref.title), ref.journal && /*#__PURE__*/React.createElement("span", null, ". ", ref.journal), "."))))), /*#__PURE__*/React.createElement("footer", {
    className: "pop-spread-signoff"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), signoff && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-signoff-text"
  }, signoff), /*#__PURE__*/React.createElement("div", {
    className: "pop-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, [issue.month, issue.year].filter(Boolean).join(' '))))));
}
Object.assign(__ds_scope, { EssaySpread });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/spreads/EssaySpread.jsx", error: String((e && e.message) || e) }); }

// components/spreads/ForecastSpread.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ForecastSpread — the numbered-manifesto feature tool. Used when an
 * issue's thesis is a list of declarations (forecasts, principles,
 * predictions). Each proposition is a tomato number-ring + bold title
 * + prose body. Defaults to the ink stock (the cobalt-era forecast
 * register); pass an accent to retint the rings.
 */
function ForecastSpread({
  kicker = 'FORECAST · 予報',
  title,
  titleJp,
  deck,
  byline,
  intro,
  propositions = [],
  outro,
  signoff,
  issue = {},
  stock = 'ink',
  accent,
  className = '',
  style,
  ...rest
}) {
  const onInk = stock === 'ink';
  const rootStyle = accent ? {
    '--issue-accent': accent,
    ...style
  } : style;
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['pop-spread', `pop-stock-${stock}`, onInk ? 'pop-spread-on-ink' : '', className].filter(Boolean).join(' '),
    style: rootStyle
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-spread-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pop-spread-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, kicker), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-spread-title"
  }, title), titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, titleJp), deck && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-deck"
  }, deck), byline && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-spread-byline"
  }, byline)), intro && /*#__PURE__*/React.createElement("p", {
    className: "pop-spread-intro"
  }, intro), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--tomato pop-spread-divider"
  }), /*#__PURE__*/React.createElement("ol", {
    className: "pop-fc-list"
  }, propositions.map(p => /*#__PURE__*/React.createElement("li", {
    className: "pop-fc-item",
    key: p.n
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-fc-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-fc-ring"
  }, p.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "pop-fc-item-title"
  }, p.title), p.titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-fc-item-title-jp"
  }, p.titleJp))), /*#__PURE__*/React.createElement("div", {
    className: "pop-fc-item-body"
  }, (p.body || []).map((para, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, para)))))), outro && /*#__PURE__*/React.createElement("p", {
    className: "pop-spread-intro",
    style: {
      marginTop: 28
    }
  }, outro), /*#__PURE__*/React.createElement("footer", {
    className: "pop-spread-signoff"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), signoff && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-signoff-text"
  }, signoff), /*#__PURE__*/React.createElement("div", {
    className: "pop-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, [issue.month, issue.year].filter(Boolean).join(' '))))));
}
Object.assign(__ds_scope, { ForecastSpread });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/spreads/ForecastSpread.jsx", error: String((e && e.message) || e) }); }

// components/spreads/InterviewSpread.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * InterviewSpread — the Q&A profile feature tool. A subject dossier
 * card (tomato lozenge badge, name/role/location) sets up a person,
 * then alternating italic-tomato questions and serif answers. The
 * last answer takes a drop cap. Used when an issue is carried by a
 * subject.
 */
function InterviewSpread({
  kicker = 'INTERVIEW · 対談',
  title,
  titleJp,
  deck,
  byline,
  subject,
  intro,
  exchanges = [],
  signoff,
  issue = {},
  stock = 'ivory',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['pop-spread', `pop-stock-${stock}`, className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-spread-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pop-spread-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, kicker), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-spread-title"
  }, title), titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, titleJp), deck && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-deck"
  }, deck), byline && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-spread-byline"
  }, byline)), subject && /*#__PURE__*/React.createElement("aside", {
    className: "pop-iv-subject"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-iv-frame"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-iv-badge",
    style: {
      width: 18,
      height: 18,
      background: 'var(--pop-tomato)',
      display: 'block',
      transform: 'rotate(45deg)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio pop-iv-kicker"
  }, "THE SUBJECT \xB7 \u5BFE\u8C61"), /*#__PURE__*/React.createElement("h3", {
    className: "pop-iv-name"
  }, subject.name, subject.nameJp && /*#__PURE__*/React.createElement("span", {
    className: "pop-iv-name-jp"
  }, subject.nameJp)), /*#__PURE__*/React.createElement("div", {
    className: "pop-iv-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-iv-role"
  }, subject.role), subject.roleJp && /*#__PURE__*/React.createElement("span", {
    className: "pop-iv-role-jp"
  }, subject.roleJp)), subject.location && /*#__PURE__*/React.createElement("div", {
    className: "pop-iv-location"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, "LOCATION"), /*#__PURE__*/React.createElement("span", {
    className: "pop-iv-location-value"
  }, subject.location)))), intro && /*#__PURE__*/React.createElement("p", {
    className: "pop-spread-intro"
  }, intro), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule"
  }), /*#__PURE__*/React.createElement("article", {
    className: "pop-iv-body"
  }, exchanges.map((x, i) => {
    const isLast = i === exchanges.length - 1;
    return /*#__PURE__*/React.createElement("div", {
      className: "pop-iv-exchange",
      key: i
    }, /*#__PURE__*/React.createElement("p", {
      className: "pop-iv-q"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pop-iv-q-mark"
    }, "Q."), /*#__PURE__*/React.createElement("span", {
      className: "pop-iv-q-text"
    }, x.q)), /*#__PURE__*/React.createElement("p", {
      className: `pop-iv-a${isLast ? ' pop-iv-a--last' : ''}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "pop-iv-a-mark"
    }, "A."), /*#__PURE__*/React.createElement("span", {
      className: "pop-iv-a-text"
    }, x.a)), !isLast && /*#__PURE__*/React.createElement("hr", {
      className: "pop-rule pop-rule--soft pop-iv-divider"
    }));
  })), /*#__PURE__*/React.createElement("footer", {
    className: "pop-spread-signoff"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), signoff && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-signoff-text"
  }, signoff), /*#__PURE__*/React.createElement("div", {
    className: "pop-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, [issue.month, issue.year].filter(Boolean).join(' '))))));
}
Object.assign(__ds_scope, { InterviewSpread });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/spreads/InterviewSpread.jsx", error: String((e && e.message) || e) }); }

// components/spreads/ReviewSpread.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ReviewSpread — the graded-survey feature tool. Used when an issue
 * tests N things and commits to a verdict. A top-line italic verdict
 * (the loudest line), a numbered rubric of criteria, then a grid of
 * subject cards — each with a score monument, optional stars, pros/cons
 * columns, and a one-line per-subject verdict. The reader can stop at
 * the verdict and still have an answer.
 */
function ReviewSpread({
  kicker = 'REVIEW · 評',
  title,
  titleJp,
  deck,
  byline,
  verdict,
  intro,
  criteria = [],
  subjects = [],
  outro,
  signoff,
  issue = {},
  stock = 'ivory',
  className = '',
  ...rest
}) {
  const Card = ({
    s
  }) => {
    const rank = String(s.rank).padStart(2, '0');
    const stars = typeof s.stars === 'number' ? Math.max(0, Math.min(5, Math.round(s.stars))) : null;
    return /*#__PURE__*/React.createElement("li", {
      className: "pop-rv-card"
    }, /*#__PURE__*/React.createElement("article", {
      className: "pop-rv-card-inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pop-rv-card-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pop-rv-card-rank"
    }, rank), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "pop-rv-card-name"
    }, s.name), s.read && /*#__PURE__*/React.createElement("p", {
      className: "pop-rv-card-read"
    }, s.read), stars !== null && /*#__PURE__*/React.createElement("span", {
      className: "pop-rv-stars",
      role: "img",
      "aria-label": `${stars} of 5`
    }, Array.from({
      length: 5
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: i < stars ? 'pop-rv-star pop-rv-star--on' : 'pop-rv-star'
    })))), /*#__PURE__*/React.createElement("div", {
      className: "pop-monument pop-rv-card-score"
    }, /*#__PURE__*/React.createElement("span", null, "SCORE"), /*#__PURE__*/React.createElement("strong", null, s.score))), /*#__PURE__*/React.createElement("div", {
      className: "pop-rv-cols"
    }, /*#__PURE__*/React.createElement("section", {
      className: "pop-rv-col pop-rv-col--pros"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pop-folio pop-rv-col-kicker"
    }, "PROS \xB7 \u9577\u6240"), /*#__PURE__*/React.createElement("ul", {
      className: "pop-rv-list"
    }, (s.pros || []).map((p, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, p)))), /*#__PURE__*/React.createElement("section", {
      className: "pop-rv-col pop-rv-col--cons"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pop-folio pop-rv-col-kicker"
    }, "CONS \xB7 \u77ED\u6240"), /*#__PURE__*/React.createElement("ul", {
      className: "pop-rv-list"
    }, (s.cons || []).map((c, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, c))))), s.verdict && /*#__PURE__*/React.createElement("p", {
      className: "pop-rv-card-verdict"
    }, s.verdict)));
  };
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['pop-spread', `pop-stock-${stock}`, className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-spread-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pop-spread-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, kicker), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-spread-title"
  }, title), titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, titleJp), deck && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-deck"
  }, deck), byline && /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-spread-byline"
  }, byline)), verdict && /*#__PURE__*/React.createElement("aside", {
    className: "pop-rv-verdict"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio pop-rv-verdict-kicker"
  }, "VERDICT \xB7 \u5224\u5B9A"), /*#__PURE__*/React.createElement("p", {
    className: "pop-rv-verdict-text"
  }, verdict)), intro && /*#__PURE__*/React.createElement("p", {
    className: "pop-spread-intro"
  }, intro), criteria.length > 0 && /*#__PURE__*/React.createElement("aside", {
    className: "pop-rv-rubric"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, "THE RUBRIC \xB7 \u8A55\u4FA1\u57FA\u6E96"), /*#__PURE__*/React.createElement("dl", {
    className: "pop-rv-rubric-list"
  }, criteria.map(c => /*#__PURE__*/React.createElement("div", {
    className: "pop-rv-rubric-row",
    key: c.n
  }, /*#__PURE__*/React.createElement("dt", {
    className: "pop-rv-rubric-term"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-rv-rubric-n"
  }, c.n), /*#__PURE__*/React.createElement("span", {
    className: "pop-rv-rubric-label"
  }, c.label), c.weight && /*#__PURE__*/React.createElement("span", {
    className: "pop-rv-rubric-weight"
  }, c.weight)), c.description && /*#__PURE__*/React.createElement("dd", {
    className: "pop-rv-rubric-desc"
  }, c.description))))), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-spread-divider"
  }), /*#__PURE__*/React.createElement("ol", {
    className: "pop-rv-grid"
  }, subjects.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.rank,
    s: s
  }))), outro && /*#__PURE__*/React.createElement("p", {
    className: "pop-spread-intro",
    style: {
      marginTop: 28
    }
  }, outro), /*#__PURE__*/React.createElement("footer", {
    className: "pop-spread-signoff"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), signoff && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-spread-signoff-text"
  }, signoff), /*#__PURE__*/React.createElement("div", {
    className: "pop-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, [issue.month, issue.year].filter(Boolean).join(' '))))));
}
Object.assign(__ds_scope, { ReviewSpread });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/spreads/ReviewSpread.jsx", error: String((e && e.message) || e) }); }

// components/structure/Colophon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Colophon — the magazine's shared footer. Publication wordmark +
 * tagline on the left, the issue monument on the right, a discovery
 * link row, and a sign-off line. Appears at the foot of every surface.
 */
function Colophon({
  issue = {
    number: '360',
    month: 'APRIL',
    year: '2026'
  },
  tagline = 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',
  links = [{
    label: 'Back Issues',
    href: '#'
  }, {
    label: 'The Wall',
    href: '#'
  }, {
    label: 'The Refusals',
    href: '#'
  }, {
    label: 'Privacy',
    href: '#'
  }, {
    label: 'Terms',
    href: '#'
  }],
  signoff = 'MIT · kernel.chat group · Published monthly.',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    className: ['pop-colophon', 'pop-stock-ivory', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "pop-section-inner"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pop-colophon-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-colophon-masthead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-wordmark-sm"
  }, "kernel", /*#__PURE__*/React.createElement("span", {
    className: "pop-wordmark-dot"
  }, "."), "chat"), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, tagline)), /*#__PURE__*/React.createElement("div", {
    className: "pop-monument pop-monument--sm"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, [issue.month, issue.year].filter(Boolean).join(' ')))), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--soft"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pop-colophon-links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href
  }, l.label))), /*#__PURE__*/React.createElement("p", {
    className: "pop-folio pop-colophon-copy"
  }, signoff)));
}
Object.assign(__ds_scope, { Colophon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Colophon.jsx", error: String((e && e.message) || e) }); }

// components/structure/IssueCover.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Asterisk = () => /*#__PURE__*/React.createElement("span", {
  className: "pop-system-glyph"
}, /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "3",
  x2: "12",
  y2: "21"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4.1",
  y1: "7.5",
  x2: "19.9",
  y2: "16.5"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4.1",
  y1: "16.5",
  x2: "19.9",
  y2: "7.5"
})));
const InkSpread = () => /*#__PURE__*/React.createElement("svg", {
  className: "pop-cover-ornament pop-cover-ornament--ink-spread",
  viewBox: "0 0 420 420",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("g", {
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 210 110 C 155 95, 105 135, 110 200 C 95 250, 120 290, 150 315 C 170 355, 230 360, 275 330 C 320 325, 360 295, 355 240 C 380 195, 345 140, 285 135 C 255 100, 230 100, 210 110 Z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M 300 310 Q 340 320 380 340 Q 395 350 410 348 L 408 362 Q 365 362 330 348 Q 315 336 300 310 Z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "380",
  cy: "245",
  r: "5"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "360",
  cy: "380",
  r: "7"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "250",
  cy: "400",
  r: "3.5"
})));
const WartySpots = () => /*#__PURE__*/React.createElement("svg", {
  className: "pop-cover-ornament pop-cover-ornament--warty-spots",
  viewBox: "0 0 420 560",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("g", {
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("ellipse", {
  cx: "58",
  cy: "46",
  rx: "7",
  ry: "6"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "348",
  cy: "62",
  rx: "9",
  ry: "7.5"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "400",
  cy: "198",
  rx: "8",
  ry: "7"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "48",
  cy: "288",
  rx: "5",
  ry: "4"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "402",
  cy: "322",
  rx: "11",
  ry: "9"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "72",
  cy: "430",
  rx: "12",
  ry: "9"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "156",
  cy: "502",
  rx: "14",
  ry: "11"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "334",
  cy: "518",
  rx: "13",
  ry: "10"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "402",
  cy: "538",
  rx: "16",
  ry: "12"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "270",
  cy: "268",
  r: "2.2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "210",
  cy: "340",
  r: "1.6"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "90",
  cy: "350",
  r: "2.4"
})));
const FlashBurn = () => /*#__PURE__*/React.createElement("svg", {
  className: "pop-cover-ornament pop-cover-ornament--flash-burn",
  viewBox: "0 0 420 560",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
  id: "pop-flash-burn",
  cx: "100%",
  cy: "0%",
  r: "85%",
  fx: "100%",
  fy: "0%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#FFF",
  stopOpacity: "1"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "22%",
  stopColor: "#FFF",
  stopOpacity: "0.92"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "46%",
  stopColor: "#FFF",
  stopOpacity: "0.55"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "72%",
  stopColor: "#FFF",
  stopOpacity: "0.18"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#FFF",
  stopOpacity: "0"
}))), /*#__PURE__*/React.createElement("rect", {
  x: "0",
  y: "0",
  width: "420",
  height: "560",
  fill: "url(#pop-flash-burn)"
}));
const ORNAMENTS = {
  'ink-spread': InkSpread,
  'warty-spots': WartySpots,
  'flash-burn': FlashBurn
};
function CoverSeal({
  label,
  date
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-seal",
    "aria-label": `${label} — ${date}`
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 120",
    className: "pop-cover-seal-svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
    id: "pop-seal-arc",
    d: "M 16 60 A 44 44 0 0 1 104 60"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "55",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "0.75",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("text", {
    className: "pop-cover-seal-label",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("textPath", {
    href: "#pop-seal-arc",
    startOffset: "50%",
    textAnchor: "middle"
  }, label)), /*#__PURE__*/React.createElement("text", {
    x: "60",
    y: "66",
    className: "pop-cover-seal-date",
    textAnchor: "middle",
    fill: "currentColor"
  }, date), /*#__PURE__*/React.createElement("polygon", {
    points: "60,82 62.2,86.8 67.5,87.4 63.5,91 64.7,96.2 60,93.4 55.3,96.2 56.5,91 52.5,87.4 57.8,86.8",
    fill: "currentColor"
  })));
}

/**
 * IssueCover — the canonical cover, the print object. Reads its paper
 * stock + composition variant from `stock` / `layout`, so every issue
 * keeps its authored identity. Optional per-issue `ornament`
 * (ink-spread / warty-spots / flash-burn) and a wax `seal`.
 *
 * Layouts: classic (centred), monument-hero (the number is the art),
 * asymmetric-left (flush-left), ledger-rule (graph-ruled audit).
 */
function IssueCover({
  issue = {
    number: '360',
    month: 'APRIL',
    year: '2026',
    price: '¥0 · BYOK'
  },
  headline = {
    prefix: 'The',
    emphasis: 'Urban Outdoors',
    suffix: 'Review',
    swash: 'A terminal companion for city coders.'
  },
  featureJp,
  tagline = 'MAGAZINE FOR CITY CODERS',
  jpTagline = '都会に住んで、コードで遊ぶための、自由なスタイルを作ろう。',
  stock = 'cream',
  layout = 'classic',
  ornament,
  seal,
  stats = ['independent', 'open-source', 'mit-licensed', 'published-monthly'],
  className = '',
  ...rest
}) {
  const Ornament = ornament ? ORNAMENTS[ornament] : null;
  const isHero = layout === 'monument-hero';
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['pop-cover', `pop-stock-${stock}`, `pop-cover--${layout}`, className].filter(Boolean).join(' ')
  }, rest), Ornament && /*#__PURE__*/React.createElement(Ornament, null), seal && /*#__PURE__*/React.createElement(CoverSeal, {
    label: seal.label,
    date: seal.date
  }), /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-dateline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, jpTagline), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, /*#__PURE__*/React.createElement(Asterisk, null), "ISSUE ", issue.number, " \xB7 ", issue.month, " ", issue.year)), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-masthead"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "pop-wordmark"
  }, "kernel", /*#__PURE__*/React.createElement("span", {
    className: "pop-wordmark-dot"
  }, "."), "chat"), /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-masthead-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-banner"
  }, tagline), /*#__PURE__*/React.createElement("span", {
    className: "pop-price"
  }, issue.price))), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--tomato"
  }), isHero && /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-hero-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number)), /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-feature"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, "FEATURE \xB7 ", issue.number), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-cover-feature-title"
  }, headline.prefix, " ", /*#__PURE__*/React.createElement("em", null, headline.emphasis), /*#__PURE__*/React.createElement("br", null), headline.suffix), headline.swash && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-cover-swash"
  }, headline.swash), featureJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, featureJp)), /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-bottom"
  }, !isHero && /*#__PURE__*/React.createElement("div", {
    className: "pop-monument"
  }, /*#__PURE__*/React.createElement("span", null, "ISSUE"), /*#__PURE__*/React.createElement("strong", null, issue.number), /*#__PURE__*/React.createElement("span", null, issue.month, " ", issue.year), /*#__PURE__*/React.createElement("span", null, issue.price)), /*#__PURE__*/React.createElement("div", {
    className: "pop-cover-stats"
  }, stats.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "pop-hash"
  }, s))))));
}
Object.assign(__ds_scope, { IssueCover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/IssueCover.jsx", error: String((e && e.message) || e) }); }

// components/structure/MagazineFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Asterisk = () => /*#__PURE__*/React.createElement("span", {
  className: "pop-system-glyph"
}, /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "3",
  x2: "12",
  y2: "21"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4.1",
  y1: "7.5",
  x2: "19.9",
  y2: "16.5"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4.1",
  y1: "16.5",
  x2: "19.9",
  y2: "7.5"
})));

/**
 * MagazineFrame — wraps any inner page (Privacy, Security, a feature)
 * with the publication masthead strip (wordmark + ISSUE folio + page
 * kicker) and a folio footer ("← BACK TO COVER"), so every route reads
 * like a spread of the same issue. Pass `title` for a full editorial
 * head block, or omit it for pages that bring their own hero.
 */
function MagazineFrame({
  kicker,
  title,
  titleJp,
  page,
  deck,
  stock = 'ivory',
  dark = false,
  issue = {
    number: '360',
    month: 'APRIL',
    year: '2026',
    tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために'
  },
  onHome,
  children,
  className = '',
  ...rest
}) {
  const folio = page === undefined ? kicker : `${kicker} · P. ${String(page).padStart(2, '0')}`;
  const home = onHome || (() => {});
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['pop-frame', dark ? 'pop-frame--dark' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("header", {
    className: `pop-frame-masthead pop-stock-${stock}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pop-frame-brand",
    onClick: home,
    "aria-label": "Return to cover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-wordmark-sm"
  }, "kernel", /*#__PURE__*/React.createElement("span", {
    className: "pop-wordmark-dot"
  }, "."), "chat"), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, issue.tagline)), /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-issue"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, /*#__PURE__*/React.createElement(Asterisk, null), "ISSUE ", issue.number, " \xB7 ", issue.month, " ", issue.year), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio pop-frame-folio"
  }, folio))), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--tomato"
  }), title && /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-kicker pop-kicker--tomato"
  }, kicker, " \xB7 \u76EE\u6B21"), /*#__PURE__*/React.createElement("h1", {
    className: "pop-display pop-frame-title"
  }, title), titleJp && /*#__PURE__*/React.createElement("p", {
    className: "pop-frame-title-jp"
  }, titleJp), deck && /*#__PURE__*/React.createElement("p", {
    className: "pop-swash pop-frame-deck"
  }, deck)))), /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-body"
  }, children), /*#__PURE__*/React.createElement("footer", {
    className: "pop-frame-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-inner"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--soft"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-row pop-frame-footer-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, issue.tagline), /*#__PURE__*/React.createElement("div", {
    className: "pop-frame-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pop-folio pop-frame-back",
    onClick: home
  }, "\u2190 BACK TO COVER"), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio pop-frame-back pop-frame-back--alt"
  }, "ISSUES \u2192")), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio"
  }, /*#__PURE__*/React.createElement(Asterisk, null), "ISSUE ", issue.number, " \xB7 ", issue.month, " ", issue.year)))));
}
Object.assign(__ds_scope, { MagazineFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/MagazineFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/archive/Archive.jsx
try { (() => {
/* global React */
const {
  Monument,
  Banner,
  Kicker,
  Colophon
} = window.KernelChatDesignSystem_52d084;

/* ──────────────────────────────────────────────────────────────
   The Issue Archive — the back catalog.
   A grid of issue spines (number monument + feature + stock + tags).
   Click a spine to open its detail panel. Data is the real issue
   identity catalog from docs/design-language.md (issues 360–378).
   ────────────────────────────────────────────────────────────── */

const ISSUES = [{
  n: '378',
  month: 'APRIL',
  year: '2026',
  feature: 'Five Terminals, One Desk',
  jp: '五つの端末',
  stock: 'ledger',
  spread: 'REVIEW',
  tags: ['REVIEW', 'AUDIT'],
  note: 'Graded survey — the review tool at full strength.'
}, {
  n: '377',
  month: 'APRIL',
  year: '2026',
  feature: 'The Convergence',
  jp: '収束',
  stock: 'ivory',
  spread: 'ESSAY',
  tags: ['ESSAY', 'STANDARDS'],
  note: 'WIRED references block, fired twice in a row.'
}, {
  n: '376',
  month: 'APRIL',
  year: '2026',
  feature: 'The Desktop Agent Ships',
  jp: 'デスクトップ制御',
  stock: 'ivory',
  spread: 'DISPATCH',
  tags: ['DISPATCH', 'SHIP'],
  note: 'Wire-style filing — numbered propositions.'
}, {
  n: '375',
  month: 'APRIL',
  year: '2026',
  feature: 'The Six Borrows',
  jp: '六つの借用',
  stock: 'cream',
  spread: 'ESSAY',
  tags: ['ESSAY', 'CREDITED'],
  note: 'Numbered-catalog layout; references as credit page.'
}, {
  n: '374',
  month: 'APRIL',
  year: '2026',
  feature: 'Against Viral Benchmarks',
  jp: 'ベンチ批判',
  stock: 'ivory',
  spread: 'ESSAY',
  tags: ['ESSAY', 'METHOD'],
  note: 'Numbers-with-methodology; asterisk-stamp ornament.'
}, {
  n: '373',
  month: 'APRIL',
  year: '2026',
  feature: 'The Editorial Neighbours',
  jp: '隣人たち',
  stock: 'cream',
  spread: 'ESSAY',
  tags: ['ESSAY'],
  note: 'First under-decorated cover — restraint by absence.'
}, {
  n: '372',
  month: 'APRIL',
  year: '2026',
  feature: 'The Audit (Room 503)',
  jp: '監査',
  stock: 'ledger',
  spread: 'ESSAY',
  tags: ['ESSAY', 'POSTMARK'],
  note: 'Postmark dateline mechanic fired; ledger-rule layout.'
}, {
  n: '371',
  month: 'APRIL',
  year: '2026',
  feature: 'After Hours',
  jp: '深夜',
  stock: 'ink',
  spread: 'INTERVIEW',
  tags: ['PROFILE', 'AFTER HOURS'],
  note: 'Cinematographer profile; flash-burn ornament.'
}, {
  n: '370',
  month: 'APRIL',
  year: '2026',
  feature: 'The Forecast',
  jp: '予報',
  stock: 'cream',
  spread: 'FORECAST',
  tags: ['FORECAST'],
  note: 'Monument-hero layout; the asterisk ★ ratified.'
}, {
  n: '369',
  month: 'APRIL',
  year: '2026',
  feature: 'The Specimen',
  jp: '標本',
  stock: 'cream',
  spread: 'DISPATCH',
  tags: ['DISPATCH', 'SHEDD'],
  note: 'Warty-spots ornament; brick ink seed.'
}, {
  n: '368',
  month: 'APRIL',
  year: '2026',
  feature: 'Anthropic Labs',
  jp: '研究所',
  stock: 'cream',
  spread: 'ESSAY',
  tags: ['PROFILE'],
  note: 'First asymmetric-left layout.'
}, {
  n: '367',
  month: 'APRIL',
  year: '2026',
  feature: 'The Sieve',
  jp: '篩',
  stock: 'ivory',
  spread: 'ESSAY',
  tags: ['ESSAY', 'SIEVE'],
  note: 'First preselection essay; ivory register.'
}, {
  n: '366',
  month: 'APRIL',
  year: '2026',
  feature: 'The Dispatch',
  jp: '発信',
  stock: 'cream',
  spread: 'DISPATCH',
  tags: ['DISPATCH'],
  note: 'Ink-spread ornament debut.'
}, {
  n: '365',
  month: 'APRIL',
  year: '2026',
  feature: 'The Craft Register',
  jp: '工芸',
  stock: 'kraft',
  spread: 'ESSAY',
  tags: ['CRAFT'],
  note: 'Kraft stock signal.'
}, {
  n: '364',
  month: 'APRIL',
  year: '2026',
  feature: 'The Forecast Spread',
  jp: '予報特集',
  stock: 'cream',
  spread: 'FORECAST',
  tags: ['FORECAST'],
  note: 'First forecast spread; cobalt accent.'
}, {
  n: '363',
  month: 'APRIL',
  year: '2026',
  feature: 'The Style Register',
  jp: 'スタイル',
  stock: 'cream',
  spread: 'ESSAY',
  tags: ['STYLE'],
  note: 'Style register.'
}, {
  n: '362',
  month: 'APRIL',
  year: '2026',
  feature: 'Vacation',
  jp: '休暇',
  stock: 'cream',
  spread: 'ESSAY',
  tags: ['QUIET'],
  note: 'Vacation / quiet.'
}, {
  n: '361',
  month: 'APRIL',
  year: '2026',
  feature: 'Summer Reading',
  jp: '夏の読書',
  stock: 'butter',
  spread: 'ESSAY',
  tags: ['READING'],
  note: 'Butter stock signal.'
}, {
  n: '360',
  month: 'APRIL',
  year: '2026',
  feature: 'The Urban Outdoors Review',
  jp: '都会のOS',
  stock: 'cream',
  spread: 'ESSAY',
  tags: ['FEATURE', 'ANCHOR'],
  note: 'The anchor identity — first issue.'
}];
const STOCK_HEX = {
  cream: '#F3E9D2',
  butter: '#EFD9A0',
  kraft: '#C8A97E',
  ivory: '#FAF9F6',
  ink: '#1F1E1D',
  ledger: '#F2EFE2'
};
function Spine({
  issue,
  active,
  onClick
}) {
  const onInk = issue.stock === 'ink';
  return /*#__PURE__*/React.createElement("button", {
    className: `arc-spine${active ? ' is-active' : ''}`,
    style: {
      background: STOCK_HEX[issue.stock],
      color: onInk ? 'var(--pop-ivory)' : 'var(--pop-ink)'
    },
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "arc-spine-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "arc-spine-num",
    style: {
      color: 'var(--pop-tomato)'
    }
  }, issue.n), /*#__PURE__*/React.createElement("span", {
    className: "arc-spine-spread",
    style: {
      color: onInk ? 'var(--pop-sepia)' : 'var(--pop-coffee)'
    }
  }, issue.spread)), /*#__PURE__*/React.createElement("div", {
    className: "arc-spine-feature"
  }, issue.feature), /*#__PURE__*/React.createElement("div", {
    className: "arc-spine-jp",
    style: {
      color: onInk ? 'var(--pop-sepia)' : 'var(--pop-coffee)'
    }
  }, issue.jp), /*#__PURE__*/React.createElement("div", {
    className: "arc-spine-foot",
    style: {
      color: onInk ? 'var(--pop-sepia)' : 'var(--pop-coffee)'
    }
  }, issue.month, " ", issue.year));
}
function Detail({
  issue
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "arc-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "arc-detail-mono"
  }, /*#__PURE__*/React.createElement(Monument, {
    number: issue.n,
    month: issue.month,
    year: issue.year
  })), /*#__PURE__*/React.createElement("div", {
    className: "arc-detail-body"
  }, /*#__PURE__*/React.createElement(Kicker, {
    tomato: true,
    jp: "\u7279\u96C6"
  }, "FEATURE \xB7 ", issue.n), /*#__PURE__*/React.createElement("h3", {
    className: "arc-detail-feature"
  }, issue.feature), /*#__PURE__*/React.createElement("p", {
    className: "arc-detail-jp"
  }, issue.jp), /*#__PURE__*/React.createElement("p", {
    className: "arc-detail-note"
  }, issue.note), /*#__PURE__*/React.createElement("div", {
    className: "arc-detail-tags"
  }, /*#__PURE__*/React.createElement(Banner, {
    variant: "kraft"
  }, issue.stock.toUpperCase(), " STOCK"), issue.tags.map(t => /*#__PURE__*/React.createElement(Banner, {
    key: t,
    variant: t === issue.tags[0] ? 'tomato' : 'ink'
  }, t)))));
}
function Archive() {
  const [active, setActive] = React.useState('371');
  const current = ISSUES.find(i => i.n === active);
  return /*#__PURE__*/React.createElement("div", {
    className: "arc-root"
  }, /*#__PURE__*/React.createElement("header", {
    className: "arc-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "arc-head-inner"
  }, /*#__PURE__*/React.createElement(Kicker, {
    jp: "\u30D0\u30C3\u30AF\u30AB\u30BF\u30ED\u30B0"
  }, "BACK CATALOG"), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h1", {
    className: "pop-display arc-title"
  }, "The Back Issues"), /*#__PURE__*/React.createElement("p", {
    className: "pop-swash arc-deck"
  }, "Every release, frozen at the moment of publication. ", ISSUES.length, " issues in the catalog."))), /*#__PURE__*/React.createElement("div", {
    className: "arc-body"
  }, /*#__PURE__*/React.createElement(Detail, {
    issue: current
  }), /*#__PURE__*/React.createElement("div", {
    className: "arc-grid"
  }, ISSUES.map(i => /*#__PURE__*/React.createElement(Spine, {
    key: i.n,
    issue: i,
    active: i.n === active,
    onClick: () => setActive(i.n)
  })))), /*#__PURE__*/React.createElement(Colophon, {
    issue: {
      number: current.n,
      month: current.month,
      year: current.year
    }
  }));
}
window.Archive = Archive;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/archive/Archive.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inner-page/LegalPage.jsx
try { (() => {
/* global React */
const {
  MagazineFrame,
  Colophon,
  KernelLoading,
  Kicker
} = window.KernelChatDesignSystem_52d084;

/* ──────────────────────────────────────────────────────────────
   Inner page — a legal spread (Privacy) wrapped in MagazineFrame.
   Proves the inner-page system end to end: a brief loading splash
   (KernelLoading), then the framed page reads like a spread of the
   same issue — masthead, folio, prose, colophon. Source:
   kernel-chat-site/src/pages/PrivacyPage.tsx + MagazineFrame.tsx.
   ────────────────────────────────────────────────────────────── */

const ISSUE = {
  number: '377',
  month: 'APRIL',
  year: '2026',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために'
};
const SECTIONS = [{
  h: 'WHAT WE KEEP',
  jp: '保管するもの',
  p: ['Almost nothing. Your conversations live in your browser, not on our servers. The keys are yours — bring your own. We hold the wrapper; you hold the work.', 'When you sign in, we store an email and a session so the magazine knows it is you between issues. That is the extent of the dossier.']
}, {
  h: 'WHAT WE NEVER DO',
  jp: '決してしないこと',
  p: ['We do not sell the catalog of what you read, ask, or build. There is no ad ledger, no shadow profile, no third-party pixel filing reports on your visit.', 'The work the magazine reports on — provenance engineering — is the thing we sell. The reading is free because the work is the product.']
}, {
  h: 'YOUR CONTROL',
  jp: '管理',
  p: ['Export everything, or delete everything, from the account panel. A deletion is a deletion: the session, the email, the lot. No tombstone, no grace-period resurrection.']
}];
function LegalPage() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "lg-splash"
    }, /*#__PURE__*/React.createElement(KernelLoading, {
      label: "LOADING ISSUE 377 \xB7 PRIVACY"
    }));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(MagazineFrame, {
    kicker: "PRIVACY",
    title: "What we keep",
    titleJp: "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC",
    page: 7,
    deck: "The short version: almost nothing leaves your device. The long version is below, and it is not long.",
    issue: ISSUE,
    onHome: () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 1100);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg-body"
  }, SECTIONS.map((s, i) => /*#__PURE__*/React.createElement("section", {
    className: "lg-section",
    key: i
  }, /*#__PURE__*/React.createElement("h2", {
    className: "lg-head"
  }, /*#__PURE__*/React.createElement(Kicker, {
    tomato: true,
    jp: s.jp
  }, s.h)), s.p.map((para, j) => /*#__PURE__*/React.createElement("p", {
    key: j,
    className: `lg-para${i === 0 && j === 0 ? ' lg-para--lead' : ''}`
  }, para)))), /*#__PURE__*/React.createElement("p", {
    className: "lg-fine"
  }, "MIT \xB7 kernel.chat group \xB7 Last revised with ISSUE 377. Questions go to the colophon."))), /*#__PURE__*/React.createElement(Colophon, {
    issue: ISSUE
  }));
}
window.LegalPage = LegalPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inner-page/LegalPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/magazine/MagazineIssue.jsx
try { (() => {
/* global React */
const {
  Kicker,
  Banner,
  Monument,
  CatalogRow,
  Terminal,
  InterviewSpread,
  ForecastSpread,
  DispatchSpread,
  ReviewSpread
} = window.KernelChatDesignSystem_52d084;

/* ──────────────────────────────────────────────────────────────
   The Magazine — kernel.chat editorial surface.
   A faithful recreation of an issue: cover → contents → feature
   spread → colophon. Two issues toggle to show stock variants
   (cream/classic vs ink/after-hours). Composes the editorial
   primitives from the design system; layout via the pop-* grammar.
   ────────────────────────────────────────────────────────────── */

const ISSUES = {
  360: {
    number: '360',
    month: 'APRIL',
    year: '2026',
    price: '¥0 · BYOK',
    stock: 'cream',
    accent: 'var(--pop-tomato)',
    jpTagline: '都会に住んで、コードで遊ぶための、自由なスタイルを作ろう。',
    headline: {
      prefix: 'The',
      emphasis: 'Urban Outdoors',
      suffix: 'Review'
    },
    swash: 'A terminal companion for city coders.',
    featureJp: '都会のコードと、自然のOS',
    contents: [{
      n: '001',
      en: 'Computer-use desktop agent',
      jp: 'デスクトップ制御',
      tag: 'FEATURE',
      tagVariant: 'tomato'
    }, {
      n: '002',
      en: 'Max 4 Live device pack (×9)',
      jp: 'M4L デバイス',
      tag: 'SOUND'
    }, {
      n: '003',
      en: 'DJ Set Builder',
      jp: 'DJ セット',
      tag: 'SOUND'
    }, {
      n: '005',
      en: 'Session isolation fix',
      jp: 'セッション分離',
      tag: 'SHIP'
    }, {
      n: '006',
      en: 'SSRF protection via dns.lookup()',
      jp: 'SSRF 対策',
      tag: 'SECURITY'
    }],
    feature: {
      kicker: 'FIELD REPORT',
      kickerJp: '実地報告',
      title: 'A day with the desktop agent',
      titleJp: 'デスクトップ・エージェントと過ごす一日',
      deck: 'We gave the Kernel a mouse and a Tuesday. It kept its own field notes.',
      body: ['The agent opens at eight, before the coffee. It reads the calendar, not because it was asked to, but because that is where the day starts. By nine it has drafted three replies, flagged one as "you will regret sending this," and quietly archived the rest.', 'What surprises you is not the competence. It is the restraint. A lesser tool fills every silence. The Kernel waits — sharp, present, on your side — and answers the question you actually asked.'],
      pull: 'It kept its own field notes. We only had to read them.',
      signoff: 'Filed from a fifth-floor walk-up, with the window open.',
      terminal: {
        title: 'kbot — desktop agent',
        lines: [{
          prompt: '$',
          text: 'kbot watch --calendar'
        }, {
          agent: '[kernel]',
          text: 'reading today… 3 events, 1 conflict',
          dim: true
        }, {
          prompt: '>',
          text: 'drafted 3 replies. 1 held for review.'
        }, {
          agent: '[kernel]',
          text: 'archived 11 threads. inbox at zero.',
          dim: true
        }]
      }
    }
  },
  371: {
    number: '371',
    month: 'APRIL',
    year: '2026',
    price: '¥0 · BYOK',
    stock: 'ink',
    accent: 'var(--pop-tomato)',
    jpTagline: '夜のコード、タングステンの光。街が眠っても、端末は起きている。',
    headline: {
      prefix: 'After',
      emphasis: 'Hours',
      suffix: 'in the Terminal'
    },
    swash: 'A cinematographer profiles the night shift.',
    featureJp: '深夜の端末、タングステンの記録',
    contents: [{
      n: '001',
      en: 'Cinematographer profile — the night shift',
      jp: '夜勤の撮影監督',
      tag: 'PROFILE',
      tagVariant: 'tomato'
    }, {
      n: '002',
      en: 'Flash-burn cover ornament',
      jp: 'フラッシュ装飾',
      tag: 'DESIGN'
    }, {
      n: '004',
      en: 'Tungsten colour grade preset',
      jp: 'タングステン補正',
      tag: 'SOUND'
    }, {
      n: '007',
      en: 'Voice loop latency fix',
      jp: '音声遅延修正',
      tag: 'SHIP'
    }],
    feature: {
      kicker: 'PROFILE',
      kickerJp: '人物',
      title: 'The night shift',
      titleJp: '夜勤',
      deck: 'A cinematographer who shoots in the dark explains why the best light is the one you almost cannot see.',
      body: ['She works tungsten — warm, low, forgiving. The screen is the only thing that has to be sharp. Everything else can fall into shadow, and most of it should.', 'The Kernel runs on the second monitor all night, a quiet pool-blue cursor in the corner. "It is the only crew member who never asks to break," she says. "And the only one who remembers the shot list."'],
      pull: 'The best light is the one you almost cannot see.',
      signoff: 'Filed at 4am, between setups, with the tungsten still warm.',
      terminal: {
        title: 'kbot — after hours',
        lines: [{
          prompt: '$',
          text: 'kbot grade --tungsten'
        }, {
          agent: '[coder]',
          text: 'applying warm low-key curve…',
          dim: true
        }, {
          prompt: '>',
          text: 'preset saved. 4 looks exported.'
        }]
      }
    }
  }
};
function Cover({
  data,
  onJump
}) {
  const onInk = data.stock === 'ink';
  return /*#__PURE__*/React.createElement("section", {
    className: `mag-cover pop-stock-${data.stock}`,
    style: {
      '--issue-accent': data.accent
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-dateline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio",
    style: onInk ? {
      color: 'var(--pop-sepia)',
      opacity: 0.85
    } : null
  }, data.jpTagline), /*#__PURE__*/React.createElement("span", {
    className: "pop-folio",
    style: onInk ? {
      color: 'var(--pop-sepia)',
      opacity: 0.9
    } : null
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-system-glyph"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "21"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.1",
    y1: "7.5",
    x2: "19.9",
    y2: "16.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.1",
    y1: "16.5",
    x2: "19.9",
    y2: "7.5"
  }))), "ISSUE ", data.number, " \xB7 ", data.month, " ", data.year)), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule",
    style: onInk ? {
      background: 'rgba(250,249,246,0.3)'
    } : null
  }), /*#__PURE__*/React.createElement("div", {
    className: "mag-masthead pop-anim-settle"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "pop-wordmark mag-wordmark",
    style: onInk ? {
      textShadow: '2px 2px 0 #000, -1px -1px 0 rgba(255,255,255,0.15)'
    } : null
  }, "kernel", /*#__PURE__*/React.createElement("span", {
    className: "pop-wordmark-dot",
    style: onInk ? {
      color: 'var(--pop-ivory)'
    } : null
  }, "."), "chat"), /*#__PURE__*/React.createElement("div", {
    className: "mag-masthead-meta"
  }, /*#__PURE__*/React.createElement(Banner, null, "MAGAZINE FOR CITY CODERS"), /*#__PURE__*/React.createElement("span", {
    className: "pop-price",
    style: onInk ? {
      color: 'var(--pop-sepia)'
    } : null
  }, data.price))), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mag-feature pop-anim-settle pop-anim-d2"
  }, /*#__PURE__*/React.createElement(Kicker, {
    tomato: true,
    jp: "\u7279\u96C6"
  }, "FEATURE \xB7 ", data.number), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display mag-feature-title",
    style: onInk ? {
      color: 'var(--pop-ivory)'
    } : null
  }, data.headline.prefix, " ", /*#__PURE__*/React.createElement("em", null, data.headline.emphasis), /*#__PURE__*/React.createElement("br", null), data.headline.suffix), /*#__PURE__*/React.createElement("p", {
    className: "pop-swash mag-swash",
    style: onInk ? {
      color: 'var(--pop-sepia)'
    } : null
  }, data.swash), /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp",
    style: onInk ? {
      color: 'var(--pop-sepia)'
    } : null
  }, data.featureJp)), /*#__PURE__*/React.createElement("div", {
    className: "mag-bottom pop-anim-fade-up pop-anim-d4"
  }, /*#__PURE__*/React.createElement(Monument, {
    number: data.number,
    month: data.month,
    year: data.year,
    price: data.price
  }), /*#__PURE__*/React.createElement("div", {
    className: "mag-stats"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-hash"
  }, "independent"), /*#__PURE__*/React.createElement("span", {
    className: "pop-hash"
  }, "open-source"), /*#__PURE__*/React.createElement("span", {
    className: "pop-hash"
  }, "mit-licensed"), /*#__PURE__*/React.createElement("span", {
    className: "pop-hash"
  }, "published-monthly")))));
}
function Contents({
  data
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "mag-section mag-reveal pop-stock-ivory"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-section-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pop-section-header"
  }, /*#__PURE__*/React.createElement(Kicker, {
    jp: "\u76EE\u6B21"
  }, "CONTENTS"), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule pop-rule--short pop-rule--tomato"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display pop-section-title"
  }, "In this issue")), /*#__PURE__*/React.createElement("div", {
    className: "mag-toc"
  }, data.contents.map(c => /*#__PURE__*/React.createElement(CatalogRow, {
    key: c.n,
    n: c.n,
    en: c.en,
    jp: c.jp,
    tag: c.tag,
    tagVariant: c.tagVariant
  })))));
}
function Feature({
  data
}) {
  const f = data.feature;
  return /*#__PURE__*/React.createElement("section", {
    className: "mag-section mag-reveal pop-stock-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-section-inner mag-feature-spread"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mag-feature-head"
  }, /*#__PURE__*/React.createElement(Kicker, {
    tomato: true,
    jp: f.kickerJp
  }, f.kicker), /*#__PURE__*/React.createElement("h2", {
    className: "pop-display mag-spread-title"
  }, f.title), /*#__PURE__*/React.createElement("p", {
    className: "pop-feature-jp"
  }, f.titleJp), /*#__PURE__*/React.createElement("p", {
    className: "pop-swash mag-deck"
  }, f.deck), /*#__PURE__*/React.createElement("p", {
    className: "mag-byline"
  }, f.signoff ? 'Field report' : '')), /*#__PURE__*/React.createElement("div", {
    className: "mag-spread-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-prose"
  }, f.body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: i === 0 ? 'mag-para mag-para--lead' : 'mag-para'
  }, p)), /*#__PURE__*/React.createElement("p", {
    className: "mag-signoff"
  }, f.signoff)), /*#__PURE__*/React.createElement("aside", {
    className: "mag-aside"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mag-pull"
  }, "\"", f.pull, "\""), /*#__PURE__*/React.createElement(Terminal, {
    title: f.terminal.title,
    lines: f.terminal.lines
  })))));
}
function Colophon({
  data,
  onJump,
  current
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "mag-section pop-stock-ink mag-colophon"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-section-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mag-colophon-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mag-wordmark-sm"
  }, "kernel.chat"), /*#__PURE__*/React.createElement("p", {
    className: "pop-folio",
    style: {
      color: 'var(--pop-sepia)',
      marginTop: 6
    }
  }, "MAGAZINE FOR CITY CODERS \xB7 \u8857\u306E\u30B3\u30FC\u30C0\u30FC\u306E\u305F\u3081\u306B")), /*#__PURE__*/React.createElement(Monument, {
    number: data.number,
    month: data.month,
    year: data.year
  })), /*#__PURE__*/React.createElement("hr", {
    className: "pop-rule",
    style: {
      background: 'rgba(250,249,246,0.2)',
      margin: '20px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mag-issue-switch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio",
    style: {
      color: 'var(--pop-sepia)'
    }
  }, "BACK CATALOG \u2014"), Object.keys(ISSUES).map(num => /*#__PURE__*/React.createElement("button", {
    key: num,
    className: `mag-switch-btn ${current === num ? 'is-active' : ''}`,
    onClick: () => onJump(num)
  }, "ISSUE ", num)))));
}

/* Sample data for the four component spreads — so the kit demonstrates
   every editorial tool, not just the essay. */
const SPREAD_DATA = {
  interview: issue => /*#__PURE__*/React.createElement(InterviewSpread, {
    title: "The night shift",
    titleJp: "\u591C\u52E4",
    deck: "A cinematographer who shoots in the dark explains the best light.",
    byline: "Interview \xB7 THE EDITORS \xB7 4,200 words",
    subject: {
      name: 'A. Mori',
      nameJp: '森',
      role: 'Cinematographer',
      roleJp: '撮影監督',
      location: 'Setagaya, Tokyo'
    },
    intro: "She works tungsten \u2014 warm, low, forgiving. The screen is the only thing that has to be sharp; everything else can fall into shadow.",
    exchanges: [{
      q: 'Why shoot in the dark?',
      a: 'Because most of the frame should fall into shadow, and most of it wants to. You light the one thing that carries the shot and let the rest go.'
    }, {
      q: 'And the Kernel runs on the second monitor?',
      a: 'A quiet pool-blue cursor in the corner, all night. It is the only crew member who never asks to break — and the only one who remembers the shot list.'
    }],
    signoff: "Filed at 4am, between setups, with the tungsten still warm.",
    issue: issue,
    stock: "ivory"
  }),
  forecast: issue => /*#__PURE__*/React.createElement(ForecastSpread, {
    title: "Six things that happen next",
    titleJp: "\u6B21\u306B\u8D77\u3053\u308B\u516D\u3064\u306E\u3053\u3068",
    deck: "The forward projection \u2014 signals, horizons, and where we'd put our money.",
    byline: "Forecast \xB7 THE EDITORS",
    propositions: [{
      n: '01',
      title: 'Agents file their own field notes',
      titleJp: '自己記録',
      body: ['The tool stops asking for instructions and starts logging what it did. The day becomes legible after the fact.']
    }, {
      n: '02',
      title: 'The terminal becomes the cover',
      titleJp: '端末が表紙に',
      body: ['Quiet utility, loud frame. The command line is the product; the magazine is the wrapper around it.']
    }, {
      n: '03',
      title: 'Restraint ships as a feature',
      titleJp: '抑制',
      body: ['The next tool wins by saying less. The silence is the product decision.']
    }],
    signoff: "Filed against the next quarter, with low confidence and high conviction.",
    issue: issue,
    stock: "ink"
  }),
  dispatch: issue => /*#__PURE__*/React.createElement(DispatchSpread, {
    slug: "WIRE \xB7 COMPUTE-USE SHIPS \xB7 \u901F\u5831",
    title: "The desktop agent ships",
    titleJp: "\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u5236\u5FA1\u3001\u51FA\u8377",
    deck: "Filed the night it landed, before the takes industrialised.",
    dateline: "TOKYO \u2014 APRIL 12, 04:00 JST",
    byline: "Dispatch \xB7 THE EDITORS",
    status: "SHIPPED",
    filedAt: "04:00 JST",
    propositions: [{
      n: '01',
      overline: 'WHAT HAPPENED',
      title: 'It opened at eight, before the coffee',
      body: ['And read the calendar unasked, because that is where the day starts.']
    }, {
      n: '02',
      overline: 'WHAT IT MEANS',
      title: 'The restraint is the feature',
      body: ['A lesser tool fills every silence. This one waits, and answers the question you actually asked.']
    }],
    bulletin: "It kept its own field notes. We only had to read them.",
    terminator: "end of dispatch \xB7 kernel.chat wire",
    signoff: "Filed from a fifth-floor walk-up, with the window open.",
    issue: issue,
    stock: "ledger"
  }),
  review: issue => /*#__PURE__*/React.createElement(ReviewSpread, {
    title: "Five terminals, one desk",
    titleJp: "\u4E94\u3064\u306E\u7AEF\u672B\u3001\u4E00\u3064\u306E\u673A",
    deck: "We tested the field and committed to a verdict.",
    byline: "Review \xB7 THE EDITORS",
    verdict: "If you only run one, run the quiet one.",
    criteria: [{
      n: '01',
      label: 'Restraint',
      weight: '30%',
      description: 'Does it fill the silence, or wait for you?'
    }, {
      n: '02',
      label: 'Memory',
      weight: '40%',
      description: 'Does it remember the shot list?'
    }, {
      n: '03',
      label: 'Footprint',
      weight: '30%'
    }],
    subjects: [{
      rank: 1,
      name: 'kbot',
      read: 'The quiet utility core',
      score: '9.2',
      stars: 5,
      pros: ['Keeps its own field notes', 'Never asks to break'],
      cons: ['Too modest to demo well'],
      verdict: 'The one to keep.'
    }, {
      rank: 2,
      name: 'synth-prog',
      read: 'Loud, capable, tiring',
      score: '7.4',
      stars: 4,
      pros: ['Fast device packs'],
      cons: ['Fills every silence', 'Forgets the list'],
      verdict: 'Brilliant for an hour.'
    }],
    signoff: "Filed from the lab bench, with the screen still warm.",
    issue: issue,
    stock: "ivory"
  })
};
const SPREAD_TYPES = [['essay', 'Essay'], ['interview', 'Interview'], ['forecast', 'Forecast'], ['dispatch', 'Dispatch'], ['review', 'Review']];
function SpreadPicker({
  value,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mag-spread-picker"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pop-folio",
    style: {
      opacity: 0.6
    }
  }, "SPREAD \u2014"), SPREAD_TYPES.map(([k, label]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: `mag-spread-btn ${value === k ? 'is-active' : ''}`,
    onClick: () => onPick(k)
  }, label)));
}
function MagazineIssue() {
  const [current, setCurrent] = React.useState('360');
  const [spread, setSpread] = React.useState('essay');
  const data = ISSUES[current];
  const issueMeta = {
    number: data.number,
    month: data.month,
    year: data.year
  };
  const jump = num => {
    setCurrent(num);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mag-root"
  }, /*#__PURE__*/React.createElement(Cover, {
    data: data,
    onJump: jump
  }), /*#__PURE__*/React.createElement(Contents, {
    data: data
  }), spread === 'essay' ? /*#__PURE__*/React.createElement(Feature, {
    data: data
  }) : /*#__PURE__*/React.createElement("div", {
    className: "mag-reveal"
  }, SPREAD_DATA[spread](issueMeta)), /*#__PURE__*/React.createElement(Colophon, {
    data: data,
    onJump: jump,
    current: current
  }), /*#__PURE__*/React.createElement(SpreadPicker, {
    value: spread,
    onPick: setSpread
  }));
}
window.MagazineIssue = MagazineIssue;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/magazine/MagazineIssue.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.CatalogRow = __ds_scope.CatalogRow;

__ds_ns.Kicker = __ds_scope.Kicker;

__ds_ns.Monument = __ds_scope.Monument;

__ds_ns.Terminal = __ds_scope.Terminal;

__ds_ns.KernelLoading = __ds_scope.KernelLoading;

__ds_ns.PopIcon = __ds_scope.PopIcon;

__ds_ns.PopPathText = __ds_scope.PopPathText;

__ds_ns.PopShape = __ds_scope.PopShape;

__ds_ns.DispatchSpread = __ds_scope.DispatchSpread;

__ds_ns.EssaySpread = __ds_scope.EssaySpread;

__ds_ns.ForecastSpread = __ds_scope.ForecastSpread;

__ds_ns.InterviewSpread = __ds_scope.InterviewSpread;

__ds_ns.ReviewSpread = __ds_scope.ReviewSpread;

__ds_ns.Colophon = __ds_scope.Colophon;

__ds_ns.IssueCover = __ds_scope.IssueCover;

__ds_ns.MagazineFrame = __ds_scope.MagazineFrame;

})();
