// Minimal type shim for picomatch — picomatch ships JS-only.
// Covers the surface kbot uses (single-pattern matcher with options).
declare module 'picomatch' {
  type Matcher = (str: string) => boolean
  interface Options {
    dot?: boolean
    matchBase?: boolean
    nocase?: boolean
    nonegate?: boolean
    basename?: boolean
    bash?: boolean
    contains?: boolean
    cwd?: string
    debug?: boolean
    expandRange?: (start: string, end: string, step?: string) => string
    failglob?: boolean
    fastpaths?: boolean
    flags?: string
    format?: (str: string) => string
    ignore?: string | string[]
    keepQuotes?: boolean
    literalBrackets?: boolean
    noextglob?: boolean
    noglobstar?: boolean
    nonull?: boolean
    noquantifiers?: boolean
    onIgnore?: (data: unknown) => void
    onMatch?: (data: unknown) => void
    onResult?: (data: unknown) => void
    posix?: boolean
    posixSlashes?: boolean
    prepend?: string
    regex?: boolean
    strictBrackets?: boolean
    strictSlashes?: boolean
    unescape?: boolean
    unixify?: boolean
    windows?: boolean
  }
  function picomatch(pattern: string | string[], options?: Options): Matcher
  export = picomatch
}
