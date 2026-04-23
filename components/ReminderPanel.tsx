"use client";

import { useState } from "react";
import { updateDocument } from "@/lib/storage";
import type { StoredDocument, DocumentReminder } from "@/lib/types";
import { BellPlus, Calendar, Trash2 } from "lucide-react";

interface ReminderPanelProps {
  documents: StoredDocument[];
  onRemindersUpdated: () => void;
}

export function ReminderPanel({ documents, onRemindersUpdated }: ReminderPanelProps) {
  const [selectedDocId, setSelectedDocId] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderLabel, setReminderLabel] = useState("");

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !reminderDate) return;

    const doc = documents.find(d => d.id === selectedDocId);
    if (!doc) return;

    const newReminder: DocumentReminder = {
      id: Math.random().toString(36).substring(2, 9),
      date: reminderDate,
      label: reminderLabel || "Custom Reminder"
    };

    updateDocument(selectedDocId, {
      reminders: [...(doc.reminders || []), newReminder]
    });

    setSelectedDocId("");
    setReminderDate("");
    setReminderLabel("");
    onRemindersUpdated();
  };

  const handleDeleteReminder = (docId: string, reminderId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    updateDocument(docId, {
      reminders: (doc.reminders || []).filter(r => r.id !== reminderId)
    });
    onRemindersUpdated();
  };

  const allReminders = documents.flatMap(doc => 
    (doc.reminders || []).map(r => ({ ...r, docName: doc.name, docId: doc.id }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm mb-12 mt-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand/[0.03] blur-3xl pointer-events-none" />
      
      <div className="flex flex-col gap-2 mb-8 relative z-10">
        <h2 className="font-display text-3xl text-textPrimary flex items-center gap-3">
          <div className="rounded-xl bg-brand/10 p-2 text-brand">
            <BellPlus className="w-6 h-6" />
          </div>
          Reminder Center
        </h2>
        <p className="text-base text-textSecondary">
          Set custom reminders for specific documents. We will notify you 10 days before the deadline.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] relative z-10">
        <form onSubmit={handleAddReminder} className="flex flex-col gap-5 rounded-2xl bg-slate-50/50 p-6 border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Select Document</label>
            <select 
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-textPrimary shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              required
            >
              <option value="">Choose a document...</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Reminder Date</label>
            <input 
              type="date"
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-textPrimary shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Label / Note (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. Renew passport, Pay premium"
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-textPrimary shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={reminderLabel}
              onChange={(e) => setReminderLabel(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <BellPlus className="w-4 h-4" />
            Add Reminder
          </button>
        </form>

        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">Active Custom Reminders</h3>
          {allReminders.length === 0 ? (
            <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center p-8 text-center text-sm text-textSecondary">
              No custom reminders set yet. Select a document and add a date to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-2 snap-y">
              {allReminders.map(reminder => (
                <div key={reminder.id} className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand/30 hover:shadow-md snap-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-textPrimary truncate">{reminder.label}</p>
                    <p className="text-sm text-textSecondary truncate mt-0.5">{reminder.docName}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand/5 px-2.5 py-1 text-xs font-bold text-brand border border-brand/10">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(reminder.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteReminder(reminder.docId, reminder.id)}
                    className="flex-shrink-0 rounded-lg p-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger transition focus:opacity-100"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
