import type { Integration } from "./types";

export const mockIntegrations: Integration[] = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Import and sync data from Google Sheets",
    icon: "FileSpreadsheet",
    status: "connected",
    connectedAt: "2 weeks ago",
    entityCounts: [
      { label: "Spreadsheets", count: 12 },
      { label: "Rows synced", count: 4821 },
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "E-commerce orders, products, and customers",
    icon: "ShoppingBag",
    status: "connected",
    connectedAt: "1 month ago",
    entityCounts: [
      { label: "Products", count: 386 },
      { label: "Orders", count: 12843 },
      { label: "Customers", count: 4821 },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Customer communication and support",
    icon: "MessageCircle",
    status: "available",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Email communication and context",
    icon: "Mail",
    status: "available",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and revenue data",
    icon: "CreditCard",
    status: "available",
  },
  {
    id: "facebook",
    name: "Facebook Ads",
    description: "Advertising campaigns and analytics",
    icon: "Facebook",
    status: "available",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Social media engagement and reach",
    icon: "Instagram",
    status: "available",
  },
  {
    id: "csv",
    name: "CSV / Excel",
    description: "Import data from spreadsheet files",
    icon: "FileUp",
    status: "available",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting and financial data",
    icon: "Calculator",
    status: "coming_soon",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM and marketing automation",
    icon: "Users",
    status: "coming_soon",
  },
];

export function getIntegrations(): Integration[] {
  return mockIntegrations;
}

export function getConnectedIntegrations(): Integration[] {
  return mockIntegrations.filter((i) => i.status === "connected");
}

export function getAvailableIntegrations(): Integration[] {
  return mockIntegrations.filter((i) => i.status === "available");
}
