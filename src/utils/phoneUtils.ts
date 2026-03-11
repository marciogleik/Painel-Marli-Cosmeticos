export const normalizePhone = (phone: string | null | undefined) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
};

export const matchesPhone = (storedPhone: string | null | undefined, searchTerm: string) => {
    const normalizedStored = normalizePhone(storedPhone);
    const normalizedSearch = normalizePhone(searchTerm);
    if (!normalizedSearch) return false;
    return normalizedStored.includes(normalizedSearch);
};
