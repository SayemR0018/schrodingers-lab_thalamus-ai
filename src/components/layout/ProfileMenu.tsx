"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Palette,
  Building2,
  Plus,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { AddWorkspaceModal } from "./AddWorkspaceModal";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileMenu({ open, onClose }: ProfileMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentUser, workspaces, activeWorkspaceId, switchWorkspace, logout } = useUserStore();
  const [addWorkspaceOpen, setAddWorkspaceOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSwitchWorkspace = (workspaceId: string) => {
    switchWorkspace(workspaceId);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        ref={menuRef}
        className={cn(
          "absolute top-full right-0 mt-2 w-64",
          "glass rounded-xl overflow-hidden shadow-xl",
          "z-50"
        )}
      >
        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent font-semibold">
              {currentUser?.initials || "FH"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {currentUser?.displayName || "User"}
              </p>
              <p className="text-xs text-foreground-muted truncate">
                {activeWorkspace?.name || "No workspace"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-2 border-b border-border">
          <MenuButton
            icon={User}
            label="Profile"
            onClick={() => handleNavigate("/workspace/settings")}
          />
          <MenuButton
            icon={Palette}
            label="Personalization"
            onClick={() => handleNavigate("/workspace/settings")}
          />
          <MenuButton
            icon={Building2}
            label="Workspace"
            onClick={() => handleNavigate("/workspace/settings")}
          />
        </div>

        {/* Workspaces */}
        <div className="p-2 border-b border-border">
          <p className="px-3 py-1.5 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
            Workspaces
          </p>
          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspaceId;
            return (
              <button
                key={workspace.id}
                onClick={() => handleSwitchWorkspace(workspace.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-accent-soft text-accent"
                    : "text-foreground hover:bg-surface-elevated"
                )}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-elevated text-xs font-medium">
                  {workspace.name.charAt(0)}
                </div>
                <span className="flex-1 text-left truncate">{workspace.name}</span>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
          <button
            onClick={() => setAddWorkspaceOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded border border-dashed border-border">
              <Plus className="h-3 w-3" />
            </div>
            <span>Add workspace</span>
          </button>
        </div>

        {/* Settings & Logout */}
        <div className="p-2">
          <MenuButton
            icon={Settings}
            label="Settings"
            onClick={() => handleNavigate("/workspace/settings")}
          />
          <MenuButton
            icon={LogOut}
            label="Log out"
            onClick={handleLogout}
            destructive
          />
        </div>
      </div>

      {/* Add Workspace Modal */}
      <AddWorkspaceModal
        open={addWorkspaceOpen}
        onClose={() => setAddWorkspaceOpen(false)}
      />
    </>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        destructive
          ? "text-destructive hover:bg-destructive-soft"
          : "text-foreground hover:bg-surface-elevated"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
