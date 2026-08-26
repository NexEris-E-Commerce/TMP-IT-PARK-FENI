import type { NavItem, ServiceItem, Usp } from "./types";

/**
 * Central business + site configuration for IT PARK FENI.
 * In Phase 5 most of this becomes admin-editable (Settings / Homepage CMS);
 * for now it is the single source of truth for the storefront chrome.
 */

export const site = {
  name: "IT PARK",
  fullName: "IT PARK FENI",
  tagline: "Complete IT Solution",
  taglineBn: "সম্পূর্ণ আইটি সমাধান",
  description:
    "Your trusted IT partner in Feni — genuine computers, components, gaming PCs, printers, networking and expert service.",
  phone: "01974862253",
  email: "itparkfeni@gmail.com",
  showrooms: [
    {
      label: "Showroom-1 (1st Floor)",
      address: "Shop# 39, 1st Floor, Mohipal Plaza, Mohipal, Feni",
    },
    {
      label: "Showroom-2 (3rd Floor)",
      address: "Shop# 6-7, 3rd Floor, Mohipal Plaza, Mohipal, Feni 3900",
    },
  ],
  socials: [
    { name: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
    { name: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
    { name: "YouTube", href: "https://youtube.com", icon: "youtube" as const },
  ],
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "PC Builder", href: "/pc-builder" },
  { label: "Brands", href: "/brands" },
  { label: "Deals", href: "/deals" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const services: ServiceItem[] = [
  {
    slug: "computer-assembly",
    title: "Computer Assembly",
    description: "Custom PC build & assembly by certified technicians.",
    icon: "assembly",
  },
  {
    slug: "laptop-service",
    title: "Laptop Service",
    description: "Repair & maintenance for all laptop brands.",
    icon: "repair",
  },
  {
    slug: "networking-solution",
    title: "Networking Solution",
    description: "Setup & configuration for home and office networks.",
    icon: "network",
  },
  {
    slug: "amc-service",
    title: "AMC Service",
    description: "Annual maintenance contracts for businesses.",
    icon: "amc",
  },
];

export const usps: Usp[] = [
  {
    title: "Free Delivery",
    description: "On orders above ৳5,000",
    icon: "delivery",
  },
  {
    title: "Safe Payment",
    description: "100% secure payment",
    icon: "payment",
  },
  {
    title: "7 Days Return",
    description: "Easy return policy",
    icon: "return",
  },
  {
    title: "24/7 Support",
    description: "We are always here",
    icon: "support",
  },
];

export const whyChoosePoints: string[] = [
  "Authorized Dealer",
  "Competitive Pricing",
  "Genuine Products",
  "Expert After-Sales Support",
];

export const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Return Policy", href: "/return-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Track Order", href: "/account/orders" },
      { label: "Return & Refund", href: "/return-policy" },
      { label: "Warranty Information", href: "/warranty" },
      { label: "Payment Methods", href: "/payment-methods" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "My Orders", href: "/account/orders" },
      { label: "My Wishlist", href: "/wishlist" },
      { label: "Compare Products", href: "/compare" },
      { label: "Account Details", href: "/account" },
      { label: "Login / Register", href: "/login" },
    ],
  },
] as const;

export const paymentMethods = ["Visa", "Mastercard", "bKash", "Nagad", "Rocket"] as const;
