export const toStringArray = (v: unknown) => {
  if (v === undefined || v === null || v === '') return undefined;
  return Array.isArray(v) ? v : [v];
};

export const toNumberArray = (v: unknown) => {
  if (v === undefined || v === null || v === '') return undefined;
  const arr = Array.isArray(v) ? v : [v];
  return arr.map(Number);
};