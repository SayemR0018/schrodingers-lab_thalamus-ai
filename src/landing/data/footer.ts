export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "The Problem", href: "#problem" },
      { label: "Business Brain", href: "#how-it-works" },
      { label: "Knowledge Graph", href: "#product" },
      { label: "AI Workforce", href: "#platform" },
      { label: "Private Access", href: "#pricing" },
    ],
  },
  {
    title: "Concepts",
    links: [
      { label: "Business Questions", href: "#questions" },
      { label: "Evidence", href: "#governance" },
      { label: "Human Approval", href: "#governance" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Product Concepts", href: "#resources" },
      { label: "Use Cases", href: "#questions" },
      { label: "FAQ", href: "#resources" },
      { label: "What is next", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Contact Us", href: "mailto:hello@thalamus.ai" },
    ],
  },
];

export type SocialLink = {
  name: string;
  href: string;
  icon: "x" | "linkedin" | "discord" | "youtube";
};

/** Replace hrefs with live profiles when they exist. */
export const socialLinks: SocialLink[] = [
  { name: "X", href: "#", icon: "x" },
  { name: "LinkedIn", href: "#", icon: "linkedin" },
  { name: "Discord", href: "#", icon: "discord" },
  { name: "YouTube", href: "#", icon: "youtube" },
];

export const utilityLinks = [
  {
    id: "contact",
    label: "Contact Us",
    detail: "hello@thalamus.ai",
    href: "mailto:hello@thalamus.ai",
  },
  {
    id: "careers",
    label: "Careers",
    detail: "Open roles when available",
    href: "#careers",
  },
  {
    id: "faq",
    label: "FAQ",
    detail: "Find answers",
    href: "#resources",
  },
  {
    id: "powered",
    label: "Powered by",
    detail: "Schrödinger's Cats",
    href: "#",
  },
  {
    id: "roadmap",
    label: "What's Next",
    detail: "Private access updates",
    href: "#pricing",
  },
] as const;
