import { Chance } from "chance";

const chance = new Chance();

export function mockMultiple<T>(mockFunction: (_: any, i: number) => T, count = chance.natural({ min: 2, max: 10 })): T[] {
  return Array.from({ length: count }).map(mockFunction);
}

export function getRandomElement<T>(array: T[]): T {
  return array[chance.natural({ max: array.length - 1 })];
}