// Legal/compliance facts for THIS site — the single source for the /privacy,
// /terms, and /accessibility pages. Fill every field during build-out; the
// pages read from here so the same policy text stays correct across edits.
//
// IMPORTANT: these are templates, not legal advice. A client's counsel should
// review them once before launch, and again if `trackers` ever gains an entry.

/**
 * A non-essential third-party script the site loads behind the consent gate.
 * @typedef {{ name: string, purpose: string, policyUrl?: string }} Tracker
 */

export const legal = {
  /** Legal entity that operates the site (as registered — "Acme Services LLC"). */
  entityName: 'Your Brand LLC',
  /** How the business is referred to in prose ("Your Brand"). */
  tradeName: 'Your Brand',

  /** Mailing address. Required by CalOPPA for a contact route. */
  address: {
    line1: '123 Main Street',
    line2: '',
    city: 'Anytown',
    region: 'PA',
    postalCode: '15221',
    country: 'US',
  },

  /** Where privacy requests go. */
  contactEmail: 'info@example.com',
  /** Optional; shown when present. */
  contactPhone: '',
  /** Accessibility feedback inbox — falls back to contactEmail when blank. */
  accessibilityEmail: '',

  /** State whose law governs the Terms (usually where the business sits). */
  governingState: 'Pennsylvania',

  /** ISO date the current policy text took effect. Bump when the text changes. */
  effectiveDate: '2026-08-18',

  /** Absolute site URL, no trailing slash — used for canonicals. */
  siteUrl: 'https://example.com',

  /**
   * Non-essential third-party scripts this site loads.
   * EMPTY IS THE DEFAULT AND THE GOAL — an empty list is what lets the privacy
   * policy say the site does no tracking and no cross-context advertising,
   * which is both true and the cheapest possible legal posture.
   *
   * Adding an entry here changes the rendered policy text. It also means the
   * script MUST load through the consent gate, never on page load — see the
   * "Third-party scripts" rules in AGENTS.md.
   * @type {Tracker[]}
   */
  trackers: [],

  /**
   * True when a form on this site collects a phone number AND the business may
   * call or text the person who submitted it. Turns on the TCPA consent
   * language in the privacy policy; the form itself must carry the matching
   * consent checkbox (see AGENTS.md → "Phone numbers and consent").
   */
  collectsPhone: false,
}

/** Single-line postal address, blank segments dropped. */
export function formattedAddress() {
  const { line1, line2, city, region, postalCode } = legal.address
  const cityLine = [[city, region].filter(Boolean).join(', '), postalCode]
    .filter(Boolean)
    .join(' ')
  return [line1, line2, cityLine].filter(Boolean).join(', ')
}

/** Where accessibility feedback should go. */
export function accessibilityContact() {
  return legal.accessibilityEmail || legal.contactEmail
}

/** Human-readable effective date ("August 18, 2026"). */
export function effectiveDateLabel() {
  const [year, month, day] = legal.effectiveDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
