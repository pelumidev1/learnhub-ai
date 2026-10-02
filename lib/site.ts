/**
 * Site-wide constants that appear in more than one place in the UI.
 *
 * The contact address lived in four separate files and had already drifted into
 * two different domains: the nav and the FAQ offered one, the legal pages
 * another. Anything a user is told to write to belongs here, once.
 */

/**
 * ⚠️ learnhubworld.com is not registered yet, so this address cannot receive
 * mail. There is no registration, therefore no nameservers, therefore no MX
 * record anywhere, and a sending server has nowhere to deliver to: every
 * message bounces immediately with "domain not found". Nobody writing in from
 * the site reaches Pelumi, and he gets no signal that they tried.
 *
 * This is the address he intends to own, chosen deliberately over
 * learnhub.africa (which he does own, but which has no MX either, so it bounces
 * today as well). Checked 2026-08-08: the domain is available at about $11/yr.
 *
 * To make it live: register it, point it at a DNS host, add MX, then forward to
 * his inbox. Until then treat every "contact us" on the site as decorative.
 */
export const CONTACT_EMAIL = "hello@learnhubworld.com";

/**
 * The WhatsApp line people can message about the AI Bootcamp (Pelumi's
 * number, given 2026-10-02 as 08105672580). Stored in international form for
 * wa.me, which needs the country code and no leading zero. Unlike the address
 * above, this one actually reaches someone, so it is the page's main contact.
 */
export const WHATSAPP_NUMBER = "2348105672580";

/** A wa.me link that opens the chat with a first line already typed. */
export function whatsappLink(text = "Hi, I have a question about the AI Bootcamp."): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
