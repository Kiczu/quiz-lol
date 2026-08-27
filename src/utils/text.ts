export const htmlToPlainText = (html: string) =>
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
