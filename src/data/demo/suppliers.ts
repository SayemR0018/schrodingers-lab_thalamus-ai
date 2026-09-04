export interface Supplier {
  id: string;
  name: string;
  nameBn: string;
  region: string;
  leadTimeDays: number;
  onTimeRate: number;
  contractRef: string;
}

export const suppliers: Supplier[] = [
  { id: "sup-1", name: "Aarong Wholesale", nameBn: "আড়ং পাইকারি", region: "Dhaka", leadTimeDays: 5, onTimeRate: 0.94, contractRef: "POL-SUP-001" },
  { id: "sup-2", name: "Yellow Clothing", nameBn: "ইয়েলো ক্লোথিং", region: "Dhaka", leadTimeDays: 7, onTimeRate: 0.88, contractRef: "POL-SUP-002" },
  { id: "sup-3", name: "Le Reve Apparel", nameBn: "লে রেভে অ্যাপারেল", region: "Chittagong", leadTimeDays: 9, onTimeRate: 0.81, contractRef: "POL-SUP-003" },
  { id: "sup-4", name: "Sailor Cosmetics", nameBn: "সেইলর কসমেটিকস", region: "Dhaka", leadTimeDays: 6, onTimeRate: 0.92, contractRef: "POL-SUP-004" },
  { id: "sup-5", name: "Emart Bangladesh", nameBn: "ই-মার্ট বাংলাদেশ", region: "Dhaka", leadTimeDays: 4, onTimeRate: 0.96, contractRef: "POL-SUP-005" },
  { id: "sup-6", name: "Bashundhara Home", nameBn: "বসুন্ধরা হোম", region: "Dhaka", leadTimeDays: 8, onTimeRate: 0.9, contractRef: "POL-SUP-006" },
  { id: "sup-7", name: "Pran Agro Foods", nameBn: "প্রাণ এগ্রো ফুডস", region: "Dhaka", leadTimeDays: 5, onTimeRate: 0.95, contractRef: "POL-SUP-007" },
  { id: "sup-8", name: "Apex Footwear", nameBn: "অ্যাপেক্স ফুটওয়্যার", region: "Dhaka", leadTimeDays: 10, onTimeRate: 0.85, contractRef: "POL-SUP-008" },
  { id: "sup-9", name: "Walton Accessories", nameBn: "ওয়ালটন অ্যাকসেসরিজ", region: "Sylhet", leadTimeDays: 7, onTimeRate: 0.89, contractRef: "POL-SUP-009" },
  { id: "sup-10", name: "Rangs Electronics", nameBn: "রংস ইলেকট্রনিক্স", region: "Dhaka", leadTimeDays: 6, onTimeRate: 0.93, contractRef: "POL-SUP-010" },
  { id: "sup-11", name: "Kids Kingdom", nameBn: "কিডস কিংডম", region: "Chittagong", leadTimeDays: 9, onTimeRate: 0.82, contractRef: "POL-SUP-011" },
  { id: "sup-12", name: "Maya Heritage", nameBn: "মায়া হেরিটেজ", region: "Rajshahi", leadTimeDays: 8, onTimeRate: 0.9, contractRef: "POL-SUP-012" },
];
