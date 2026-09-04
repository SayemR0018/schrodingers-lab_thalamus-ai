"use client";

import { useState } from "react";
import { User, Mail, Lock, Save, Globe, Clock, Calendar, CheckCircle } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

export function AccountSettings() {
  const { currentUser, updateProfile } = useUserStore();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [language, setLanguage] = useState(currentUser?.language || "English");
  const [timezone, setTimezone] = useState(currentUser?.timezone || "Asia/Dhaka");
  const [dateFormat, setDateFormat] = useState(currentUser?.dateFormat || "DD/MM/YYYY");
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ displayName, email, language, timezone, dateFormat });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordUpdate = () => {
    setPasswordError("");
    
    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Mock success
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
        
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent text-xl font-semibold">
            {currentUser?.initials || "FH"}
          </div>
          <div>
            <p className="font-medium text-foreground">{currentUser?.displayName}</p>
            <button className="text-sm text-accent hover:underline">Change avatar</button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Display name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
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
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <label className="block text-sm font-medium text-foreground mb-1.5">Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-lg appearance-none",
                  "bg-surface-elevated border border-border",
                  "text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                )}
              >
                <option value="English">English</option>
                <option value="Bangla">Bangla</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Date format</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-lg appearance-none",
                  "bg-surface-elevated border border-border",
                  "text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                )}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
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

      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Password</h2>
        
        {passwordSaved && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-success-soft text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Password updated successfully (demo only)</span>
          </div>
        )}
        
        {passwordError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive-soft text-destructive text-sm">
            {passwordError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
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
            <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
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
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm new password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-lg",
                  "bg-surface-elevated border border-border",
                  "text-foreground placeholder:text-foreground-subtle",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                )}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="mt-6 px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
        >
          Update password
        </button>
      </div>
    </div>
  );
}
