// ── Site-wide configuration ──────────────────────────────────────────────────
// Update these values before going live.

// WhatsApp number in international format WITHOUT + or spaces.
// Example: India +91 98765 43210 → "919876543210"
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919XXXXXXXXX";

// Builds a wa.me link, optionally with a pre-filled message.
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const SITE_PHONE = "+91 9XXXXXXXXX";
export const SITE_EMAIL = "hello@maddheshiyastudio.com";
export const SITE_ADDRESS = "Koilahiya Chauraha, Mangalpur, Post Sarhari, Tikariya Road, Pipiganj, 273165";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/mithlesh_mds/",
  facebook:  "https://www.facebook.com/mithlesh.maddheshiya.3",
  linkedin:  "https://www.linkedin.com/groups/14707064/",
  whatsapp:  `https://wa.me/${WHATSAPP_NUMBER}`,
};
