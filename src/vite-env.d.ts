/// <reference types="vite/client" />

/**
 * Vite resolves `?inline` CSS imports to the stylesheet's text. Declared here
 * because the island loads Leaflet's CSS as a string rather than letting the
 * bundler hoist it into the document head.
 */
declare module '*.css?inline' {
  const css: string;
  export default css;
}
