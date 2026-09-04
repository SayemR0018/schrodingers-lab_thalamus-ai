export interface Policy {
  id: string;
  title: string;
  titleBn: string;
  category: "returns" | "supplier" | "shipping" | "pricing";
  body: string;
  bodyBn: string;
  effectiveFrom: string;
}

export const policies: Policy[] = [
  {
    id: "pol-return",
    title: "Return Policy",
    titleBn: "রিটার্ন নীতিমালা",
    category: "returns",
    body: "Returns accepted within 7 days of delivery for unworn apparel and unopened beauty items.",
    bodyBn: "অব্যবহৃত পোশাক ও খোলা-না-করা সৌন্দর্য পণ্যের জন্য ডেলিভারির ৭ দিনের মধ্যে রিটার্ন গ্রহণযোগ্য।",
    effectiveFrom: "2024-01-01",
  },
  {
    id: "pol-supplier",
    title: "Supplier Agreement",
    titleBn: "সরবরাহকারী চুক্তি",
    category: "supplier",
    body: "All suppliers must maintain 90%+ on-time delivery and honor price-window of 30 days.",
    bodyBn: "সমস্ত সরবরাহকারীকে ৯০%+ সময়মতো ডেলিভারি বজায় রাখতে এবং ৩০ দিনের মূল্য-উইন্ডো সম্মান করতে হবে।",
    effectiveFrom: "2024-03-15",
  },
];
