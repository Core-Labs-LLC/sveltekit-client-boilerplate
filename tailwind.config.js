/**
 * Semantic design tokens.
 *
 * Components name the ROLE a colour plays (`bg-brand`, `text-ink-muted`), never
 * the colour itself (`bg-blue-600`, `text-gray-900`). Each site fills in what
 * those roles mean in `src/app.css`, which is what lets one section component
 * look completely different on two sites — and is why a shared component
 * catalogue does not produce fourteen identical sites.
 *
 * `scripts/check-design-tokens.mjs` enforces this for section components.
 */

/** rgb(var(--x) / <alpha-value>) so Tailwind opacity modifiers work: `bg-brand/10`. */
const token = (name) => `rgb(var(${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        brand: token('--brand'),
        'brand-ink': token('--brand-ink'),
        accent: token('--accent'),
        surface: token('--surface'),
        'surface-alt': token('--surface-alt'),
        ink: token('--ink'),
        'ink-muted': token('--ink-muted'),
        line: token('--line'),
      },
      borderRadius: {
        token: 'var(--radius)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
