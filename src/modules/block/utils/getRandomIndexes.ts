import { blocksCount } from "./blocks";

export default function getRandomIndexes(
  count: number,
  preventDuplicates = true
) {
  const indexes: Array<number> = [];
  const max = blocksCount - 1;
  const min = 0;

  for (let i = 0; i < count; i++) {
    let index = Math.floor(Math.random() * (max - min + 1)) + min;

    if (preventDuplicates) {
      while (indexes.includes(index)) {
        index = Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
    indexes.push(index);
  }
  return indexes;
}
