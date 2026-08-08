/**
 * Site-wide constants that appear in more than one place in the UI.
 *
 * The contact address lived in four separate files and had already drifted into
 * two different domains — the nav and the FAQ offered one, the legal pages
 * another. Anything a user is told to write to belongs here, once.
 */

/**
 * ⚠️ learnhub.africa has no MX record yet, so mail sent here bounces. The
 * domain is on Cloudflare; Email Routing will forward it. Until that is set up,
 * every "contact us" on the site is a dead end.
 */
export const CONTACT_EMAIL = "hello@learnhub.africa";
