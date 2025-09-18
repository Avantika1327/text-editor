export interface TemplateItem {
  id: string;
  name: string;
  html: string;
  css: string;
  json: any;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  type?: "header" | "footer" | "generic"; 
  metadata?: Record<string, string>;
}

const KEY = "grapes_templates_v1";
  

const readAll = (): TemplateItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TemplateItem[]) : [];
  } catch (err) {
    console.error("Failed to read templates:", err);
    return [];
  }
};

const writeAll = (items: TemplateItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};


export const generateId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;


export const getTemplates = (): TemplateItem[] => {
  return readAll().sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
};


export const getTemplate = (id: string) => {
  return readAll().find((t) => t.id === id) || null;
};


export const saveTemplate = (tpl: TemplateItem) => {
  const items = readAll();
  const idx = items.findIndex((t) => t.id === tpl.id);
  const now = new Date().toISOString();

  if (idx >= 0) {
    items[idx] = { ...tpl, updatedAt: now, type: tpl.type || "generic" };
  } else {
    items.push({
      ...tpl,
      createdAt: now,
      updatedAt: now,
      archived: false,
      type: tpl.type || "generic",
    });
  }

  writeAll(items);
  return tpl;
};


export const deleteTemplate = (id: string) => {
  const items = readAll().filter((t) => t.id !== id);
  writeAll(items);
};

export const setArchive = (id: string, archived: boolean) => {
  const items = readAll();
  const idx = items.findIndex((t) => t.id === id);
  if (idx >= 0) {
    items[idx].archived = archived;
    items[idx].updatedAt = new Date().toISOString();
    writeAll(items);
  }
};
