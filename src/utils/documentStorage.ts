// src/utils/documentStorage.ts
export interface DocumentItem {
  id: string;
  meta: any;
  html: string;
  css: string;
  archived: boolean;
  draft: boolean;
  createdAt: string;
  updatedAt: string;
  applyBy?: string | null;

  
}

const KEY = "documents_v1";

export function readAll(): DocumentItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(docs: DocumentItem[]) {
  localStorage.setItem(KEY, JSON.stringify(docs));
}

export function createDocument(doc: DocumentItem) {
  const all = readAll();
  all.push(doc);
  saveAll(all);
}

export function updateDocument(id: string, data: Partial<DocumentItem>) {
  const all = readAll();
  const idx = all.findIndex(d => d.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    saveAll(all);
  }
}

export function deleteDocument(id: string) {
  saveAll(readAll().filter(d => d.id !== id));
}

export function archiveDocument(id: string) {
  updateDocument(id, { archived: true });
}

export function getDocument(id: string) {
  return readAll().find(d => d.id === id);
}

export function listDocuments(includeArchived = false) {
  const all = readAll();
  return includeArchived ? all : all.filter(d => !d.archived);
}

export function toggleArchiveDocument(id: string) {
  const all = readAll();
  const idx = all.findIndex(d => d.id === id);
  if (idx >= 0) {
    all[idx].archived = !all[idx].archived;
    all[idx].updatedAt = new Date().toISOString();
    saveAll(all);
  }
}
