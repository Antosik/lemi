export const boldIF = (string: string, condition: boolean): string => condition ? `**${string}**` : string;
export const underlineIF = (string: string, condition: boolean): string => condition ? `__${string}__` : string;

export const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);
