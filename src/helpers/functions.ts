import { URL } from "url";

export const boldIF = (string: string, condition: boolean): string => condition ? `**${string}**` : string;
export const underlineIF = (string: string, condition: boolean): string => condition ? `__${string}__` : string;

export const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);

export const isValidURL = (s: string): boolean => {
  try {
    // @ts-ignore
    const _ = new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};
