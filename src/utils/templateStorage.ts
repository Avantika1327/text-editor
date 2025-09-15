// Template type
export interface TemplateItem {
  id: string;
  name: string;
  html: string;
  css: string;
  json: any;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  metadata?: Record<string, string>;
}

// LocalStorage key
const KEY = "grapes_templates_v1";

// 🔹 Internal: read all items
const readAll = (): TemplateItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TemplateItem[]) : [];
  } catch (err) {
    console.error("Failed to read templates:", err);
    return [];
  }
};

// 🔹 Internal: write all items
const writeAll = (items: TemplateItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

// 🔹 Generate unique ID
export const generateId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

// 🔹 Get all templates (sorted by createdAt)
export const getTemplates = (): TemplateItem[] => {
  return readAll().sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
};

// 🔹 Get single template
export const getTemplate = (id: string) => {
  return readAll().find((t) => t.id === id) || null;
};

// 🔹 Save (new or update) template
export const saveTemplate = (tpl: TemplateItem) => {
  const items = readAll();
  const idx = items.findIndex((t) => t.id === tpl.id);

  if (idx >= 0) {
    items[idx] = { ...tpl, updatedAt: new Date().toISOString() };
  } else {
    items.push({
      ...tpl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    });
  }

  writeAll(items);
  return tpl;
};

// 🔹 Delete template
export const deleteTemplate = (id: string) => {
  const items = readAll().filter((t) => t.id !== id);
  writeAll(items);
};

// 🔹 Archive / Unarchive
export const setArchive = (id: string, archived: boolean) => {
  const items = readAll();
  const idx = items.findIndex((t) => t.id === id);
  if (idx >= 0) {
    items[idx].archived = archived;
    items[idx].updatedAt = new Date().toISOString();
    writeAll(items);
  }
};

// 🔹 Duplicate template
export const duplicateTemplate = (id: string) => {
  const tpl = getTemplate(id);
  if (!tpl) return null;

  const copy: TemplateItem = {
    ...tpl,
    id: generateId(),
    name: tpl.name + " (copy)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  };

  saveTemplate(copy);
  return copy;
};

// 🔹 Get summary report
export const getSummary = () => {
  const items = getTemplates();

  const total = items.length;
  const archived = items.filter((t) => t.archived).length;
  const active = total - archived;

  // Last updated template (latest updatedAt)
  const lastUpdated = items.length
    ? items.reduce((latest, tpl) =>
        tpl.updatedAt > latest.updatedAt ? tpl : latest
      ).updatedAt
    : null;

  return {
    total,
    active,
    archived,
    lastUpdated,
  };
};
