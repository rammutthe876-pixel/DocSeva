"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DocCard } from "@/components/DocCard";
import { getAllDocuments, getAllFolders, saveFolder, deleteFolder, updateFolder } from "@/lib/storage";
import { computeDaysUntil } from "@/lib/utils";
import type { StoredDocument, Folder } from "@/lib/types";
import { InteractiveFolder } from "@/components/InteractiveFolder";
import { ReminderPanel } from "@/components/ReminderPanel";
import { ExpiryAlerts } from "@/components/ExpiryAlerts";
import { Plus, Trash2, Edit2, X, Check, FileText } from "lucide-react";

export default function VaultPage() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");

  useEffect(() => {
    setDocuments(getAllDocuments());
    setFolders(getAllFolders());
  }, []);

  const expiredCount = documents.filter(
    (doc) => doc.soonestExpiry && computeDaysUntil(doc.soonestExpiry) < 0
  ).length;

  const urgentCount = documents.filter((doc) => {
    if (!doc.soonestExpiry) return false;
    const d = computeDaysUntil(doc.soonestExpiry);
    return d >= 0 && d <= 14;
  }).length;

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const colors = ["#5227FF", "#FF2752", "#27FF52", "#FFD727", "#27D7FF"];
    const newFolder: Folder = {
      id: Math.random().toString(36).substring(2, 9),
      name: newFolderName.trim(),
      createdAt: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    saveFolder(newFolder);
    setFolders(getAllFolders());
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  const handleUpdateFolder = (id: string) => {
    if (!editFolderName.trim()) return;
    updateFolder(id, { name: editFolderName.trim() });
    setFolders(getAllFolders());
    setEditingFolderId(null);
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm("Delete this folder? Documents inside won't be deleted.")) {
      deleteFolder(id);
      setFolders(getAllFolders());
      if (selectedFolderId === id) setSelectedFolderId(null);
    }
  };

  const displayedDocuments = selectedFolderId
    ? documents.filter(doc => doc.folderId === selectedFolderId)
    : documents;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
      <AppHeader current="vault" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Your Personal Vault</p>
            <h1 className="mt-3 font-display text-5xl text-textPrimary sm:text-6xl">Secure workspace.</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-textSecondary">
              Your documents are saved locally. This vault summarizes what needs attention so you never miss a deadline.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
          >
            Upload New Document
          </Link>
        </div>

        <div className="mt-10">
          <ExpiryAlerts />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Total documents</p>
            <p className="mt-2 text-4xl font-semibold text-textPrimary">{documents.length}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Urgent items</p>
            <p className="mt-2 text-4xl font-semibold text-warning">{urgentCount}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Expired</p>
            <p className="mt-2 text-4xl font-semibold text-danger">{expiredCount}</p>
          </div>
        </div>

        <ReminderPanel documents={documents} onRemindersUpdated={() => setDocuments(getAllDocuments())} />

        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-4xl text-textPrimary">Folders</h2>
            <button 
              onClick={() => setIsCreatingFolder(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-textPrimary hover:bg-slate-200 transition"
            >
              <Plus className="w-4 h-4" />
              Create Folder
            </button>
          </div>

          {isCreatingFolder && (
            <div className="mb-8 flex items-center gap-4 rounded-2xl border border-brand bg-brand/5 p-4 max-w-md">
              <input 
                type="text" 
                placeholder="Folder name..."
                className="flex-1 bg-transparent outline-none font-semibold text-textPrimary"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
              <button onClick={handleCreateFolder} className="text-brand hover:scale-110 transition">
                <Check className="w-6 h-6" />
              </button>
              <button onClick={() => setIsCreatingFolder(false)} className="text-textSecondary hover:scale-110 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-12 mb-12">
            {/* "All" Folder */}
            <div 
              className={`flex flex-col items-center gap-4 cursor-pointer group`}
              onClick={() => setSelectedFolderId(null)}
            >
              <div className={`p-4 rounded-3xl transition ${selectedFolderId === null ? "bg-brand/10 ring-2 ring-brand" : "hover:bg-slate-50"}`}>
                <InteractiveFolder 
                  size={0.8} 
                  color="#1A56DB" 
                  label="ALL"
                  items={[
                    <FileText key="1" className="w-6 h-6 text-slate-400" />,
                    <FileText key="2" className="w-6 h-6 text-slate-500" />
                  ]}
                />
              </div>
              <span className={`font-semibold ${selectedFolderId === null ? "text-brand" : "text-textSecondary"}`}>All Docs</span>
            </div>

            {folders.map(folder => (
              <div key={folder.id} className="flex flex-col items-center gap-4 group relative">
                <div 
                  className={`p-4 rounded-3xl transition cursor-pointer ${selectedFolderId === folder.id ? "bg-brand/10 ring-2 ring-brand" : "hover:bg-slate-50"}`}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <InteractiveFolder 
                    size={0.8} 
                    color={folder.color || "#5227FF"} 
                    label={folder.name.toUpperCase().slice(0, 8)}
                    items={[
                      <FileText key="1" className="w-6 h-6 text-slate-400" />,
                      <FileText key="2" className="w-6 h-6 text-slate-500" />
                    ]}
                  />
                  
                  {/* Folder Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFolderId(folder.id);
                        setEditFolderName(folder.name);
                      }}
                      className="p-1.5 bg-white shadow-md rounded-lg text-textSecondary hover:text-brand"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="p-1.5 bg-white shadow-md rounded-lg text-textSecondary hover:text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingFolderId === folder.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      className="w-24 text-center font-semibold text-textPrimary border-b-2 border-brand outline-none"
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdateFolder(folder.id)}
                      autoFocus
                    />
                    <button onClick={() => handleUpdateFolder(folder.id)} className="text-brand">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className={`font-semibold ${selectedFolderId === folder.id ? "text-brand" : "text-textSecondary"}`}>{folder.name}</span>
                )}
              </div>
            ))}
          </div>

          <h2 className="font-display text-4xl text-textPrimary mb-8">
            {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : "All Documents"}
          </h2>

          {displayedDocuments.length === 0 ? (
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center sm:p-20">
              <h2 className="font-display text-4xl text-textPrimary">Empty folder.</h2>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-textSecondary">
                Move documents here or upload new ones to this folder.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedDocuments.map((doc) => (
                <DocCard 
                  key={doc.id} 
                  document={doc} 
                  folders={folders}
                  onRefresh={() => {
                    setDocuments(getAllDocuments());
                    setFolders(getAllFolders());
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
