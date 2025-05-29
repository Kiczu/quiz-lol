export const filterEmptyFields = (obj: Record<string, any>) => {
    Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== "" && value !== undefined));
}