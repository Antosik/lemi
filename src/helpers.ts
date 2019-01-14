import { format as formatDate, parse as parseDate } from "date-fns";

export const reformatDate = (date: string, previous: string, next: string) => formatDate(parseDate(date, previous, new Date()), next);
export { formatDate, parseDate };

export const boldIF = (string: string, condition: boolean) => condition ? `**${string}**` : string;
export const underlineIF = (string: string, condition: boolean) => condition ? `__${string}__` : string;