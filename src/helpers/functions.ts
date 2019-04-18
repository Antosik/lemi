export const boldIF = (string: string, condition: boolean) => condition ? `**${string}**` : string;
export const underlineIF = (string: string, condition: boolean) => condition ? `__${string}__` : string;
