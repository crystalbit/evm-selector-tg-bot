export const findSelectors = (text: string): string[] => {
  const selectorsSearch = text.match(/0x[a-fA-F0-9]{8}\b/g) || [];
  return [...new Set(selectorsSearch)];
};

export const findEventHashes = (text: string): string[] => {
  const eventHashesSearch = text.match(/0x[a-fA-F0-9]{64}\b/g) || [];
  return [...new Set(eventHashesSearch)];
};
