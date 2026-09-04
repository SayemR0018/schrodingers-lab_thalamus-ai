"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle, FileBarChart, CheckSquare, Database, Check } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "insight" | "report" | "approval" | "data";
  title: string;
  message: string;
  time: string;
  href: string;
}

const notifications: Notification[] = [
  {
    id: "n1",
    type: "insight",
    title: "New insight detected",
    message: "Classic Shirt stockout risk identified",
    time: "1 hour ago",
    href: "/workspace/insights/insight-inventory-risk",
  },
  {
    id: "n2",
    type: "approval",
    title: "Action requires approval",
    message: "Restock recommendation waiting for review",
    time: "2 hours ago",
    href: "/workspace/approvals",
  },
  {
    id: "n3",
    type: "report",
    title: "Report generated",
    message: "Sales analysis report is ready",
    time: "3 hours ago",
    href: "/workspace/reports/report-sales-drop",
  },
  {
    id: "n4",
    type: "data",
    title: "Data update",
    message: "Business context updated to v1.4",
    time: "4 hours ago",
    href: "/workspace/data-sources",
  },
];

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const router = useRouter();
  const { readNotificationIds, markNotificationRead, markAllNotificationsRead } = useUserStore();
  
  const readIds = useMemo(() => new Set(readNotificationIds), [readNotificationIds]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const handleNotificationClick = (notification: Notification) => {
    markNotificationRead(notification.id);
    router.push(notification.href);
    onClose();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead(notifications.map((n) => n.id));
  };

  if (!open) return null;

  const typeIcons = {
    insight: AlertCircle,
    report: FileBarChart,
    approval: CheckSquare,
    data: Database,
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 z-50 w-80 glass rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </h3>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-foreground-muted hover:text-foreground" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-foreground-muted">
              No notifications
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                const isRead = readIds.has(notification.id);
                return (
                  <li key={notification.id}>
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors text-left",
                        !isRead && "bg-accent-soft/30"
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated shrink-0">
                        <Icon className="h-4 w-4 text-foreground-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm truncate",
                          isRead ? "text-foreground-muted" : "text-foreground font-medium"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-foreground-muted truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-foreground-subtle mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!isRead && (
                        <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border">
          <button
            onClick={() => {
              router.push("/workspace/activity");
              onClose();
            }}
            className="text-sm text-accent hover:underline"
          >
            View all activity
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>
      </div>
    </>
  );
}
