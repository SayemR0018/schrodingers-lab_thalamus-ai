"use client";

import { useState, useEffect } from "react";
import { X, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDataStore, type DataCategoryType, type DataRecord } from "@/store/data.store";
import { EditRecordModal } from "./EditRecordModal";
import { cn } from "@/lib/utils";

interface DataDetailDrawerProps {
  category: DataCategoryType | null;
  onClose: () => void;
}

export function DataDetailDrawer({ category, onClose }: DataDetailDrawerProps) {
  const { categories, getCategoryRecords, deleteRecord, getActiveVersion } = useDataStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [lastCategory, setLastCategory] = useState(category);

  const categoryInfo = categories.find((c) => c.id === category);
  const allRecords = category ? getCategoryRecords(category) : [];
  const activeVersion = getActiveVersion();

  // Reset on category change
  if (lastCategory !== category) {
    setLastCategory(category);
    setSearchQuery("");
    setPage(1);
  }

  // Filter records
  const filteredRecords = allRecords.filter((record) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(record.data).some((val) =>
      String(val).toLowerCase().includes(query)
    );
  });

  // Paginate
  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editingRecord && !deleteConfirm) onClose();
    };
    if (category) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [category, onClose, editingRecord, deleteConfirm]);

  const handleDelete = (recordId: string) => {
    if (!category) return;
    deleteRecord(category, recordId);
    setDeleteConfirm(null);
  };

  if (!category || !categoryInfo) return null;

  // Get column headers from first record
  const columns = allRecords.length > 0 ? Object.keys(allRecords[0].data) : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 z-40 h-full w-full max-w-2xl bg-surface border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{categoryInfo.name}</h2>
            <p className="text-sm text-foreground-muted">
              {categoryInfo.recordCount.toLocaleString()} records • v{activeVersion?.version}
            </p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-elevated">
            <X className="h-4 w-4 text-foreground-muted" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg",
                "bg-surface-elevated border border-border",
                "text-foreground placeholder:text-foreground-subtle",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              )}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto" style={{ height: "calc(100% - 180px)" }}>
          {paginatedRecords.length === 0 ? (
            <div className="p-8 text-center text-foreground-muted">
              {searchQuery ? "No records match your search" : "No records in this category"}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-surface-elevated sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-medium text-foreground-subtle uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-elevated/50">
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-3 text-sm text-foreground">
                        {String(record.data[col])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="p-1.5 rounded hover:bg-surface-elevated text-foreground-muted hover:text-foreground"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(record.id)}
                          className="p-1.5 rounded hover:bg-destructive-soft text-foreground-muted hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-sm text-foreground-muted">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRecord && category && (
        <EditRecordModal
          record={editingRecord}
          category={category}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative glass rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete this record?</h3>
            <p className="text-sm text-foreground-muted mb-4">
              This action will create a new data version. The deletion will be recorded in version history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
