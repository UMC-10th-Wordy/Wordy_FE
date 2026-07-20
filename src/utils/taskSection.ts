export function splitIntoColumns<T>(items: T[]): [T[], T[]] {
  const left: T[] = []
  const right: T[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return [left, right]
}
