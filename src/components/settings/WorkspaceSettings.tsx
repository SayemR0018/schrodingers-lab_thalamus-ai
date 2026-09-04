"use client";

import { useState } from "react";
import { Building2, Globe, DollarSign, Clock, Save } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

export function WorkspaceSettings() {
  const { getActiveWorkspace, updateWorkspace } = useUserStore();
  const workspace = getActiveWorkspace();
  
  const [name, setName] = useState(workspace?.name || "");
  const [industry, setIndustry] = useState(workspace?.industry || "");
  const [currency, setCurrency] = useState(workspace?.currency || "BDT");
  const [timezone, setTimezone] = useState(workspace?.timezone || "Asia/Dhaka");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWorkspace({ name, industry, currency, timezone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Workspace</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Business name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg",
                "bg-surface-elevated border border-border",
                "text-foreground placeholder:text-foreground-subtle",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg appearance-none",
                "bg-surface-elevated border border-border",
                "text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              )}
            >
              <option>E-commerce</option>
              <option>Retail</option>
              <option>SaaS</option>
              <option>Manufacturing</option>
              <option>Services</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Currency</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg appearance-none",
                "bg-surface-elevated border border-border",
                "text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              )}
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Timezone</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg appearance-none",
                "bg-surface-elevated border border-border",
                "text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              )}
            >
              <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
              <option value="America/New_York">America/New York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
        >
          <Save className="h-4 w-4" />
          Save changes
        </button>
        {saved && <span className="text-sm text-success">Saved!</span>}
      </div>
    </div>
  );
}
