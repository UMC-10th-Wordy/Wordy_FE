export interface RowSnapshot {
  id: string
  section: string
  rect: DOMRect
}

export interface LineRect {
  top: number
  left: number
  width: number
  height: number
}

interface LineIndicatorResult {
  itemId: string | null
  insertAfter: boolean
  line: LineRect | null
}

interface RowPair {
  left?: RowSnapshot
  right?: RowSnapshot
}

interface Candidate {
  center: number
  result: LineIndicatorResult
}

const LINE_THICKNESS = 4
const LINE_GAP = 6
const NEW_ROW_GAP = 16
const WEST_ZONE_WIDTH = 48

function groupIntoRowPairs(rows: RowSnapshot[], columnRects: DOMRect[]): RowPair[] {
  const leftColumn = columnRects[0]
  const rightColumn = columnRects[1]
  const boundaryX = rightColumn ? (leftColumn.right + rightColumn.left) / 2 : Infinity

  const leftRows = rows
    .filter((row) => row.rect.left < boundaryX)
    .sort((a, b) => a.rect.top - b.rect.top)
  const rightRows = rows
    .filter((row) => row.rect.left >= boundaryX)
    .sort((a, b) => a.rect.top - b.rect.top)
  const rowCount = Math.max(leftRows.length, rightRows.length)

  return Array.from({ length: rowCount }, (_, index) => ({
    left: leftRows[index],
    right: rightRows[index],
  }))
}

/* 카드 없음→가로선, 행에 1개→옆 세로선, 꽉 찬 행 사이→세로선, 행 앞(맨 앞 포함)→세로선, 맨 뒤 새 행→가로선 */
export function computeLineIndicator(
  rows: RowSnapshot[],
  columnRects: DOMRect[],
  pointerX: number,
  pointerY: number,
): LineIndicatorResult {
  const leftColumn = columnRects[0]
  const rightColumn = columnRects[1]
  if (!leftColumn) return { itemId: null, insertAfter: false, line: null }

  if (rows.length === 0) {
    return {
      itemId: null,
      insertAfter: false,
      line: {
        top: leftColumn.top,
        left: leftColumn.left,
        width: leftColumn.width,
        height: LINE_THICKNESS,
      },
    }
  }

  const pairs = groupIntoRowPairs(rows, columnRects)
  const boundaryX = rightColumn ? (leftColumn.right + rightColumn.left) / 2 : leftColumn.right

  const pairTop = (pair: RowPair) =>
    Math.min(pair.left?.rect.top ?? Infinity, pair.right?.rect.top ?? Infinity)
  const pairBottom = (pair: RowPair) =>
    Math.max(pair.left?.rect.bottom ?? 0, pair.right?.rect.bottom ?? 0)
  const pairHeight = (pair: RowPair) =>
    Math.max(pair.left?.rect.height ?? 0, pair.right?.rect.height ?? 0)

  const insertBeforeLine = (anchor: RowSnapshot): LineRect => ({
    top: anchor.rect.top,
    left: leftColumn.left - LINE_GAP - LINE_THICKNESS,
    width: LINE_THICKNESS,
    height: anchor.rect.height,
  })

  /* 박스 9시 방향 여백에 놓으면 그 높이의 행 앞에 바로 세로선 표시 (12시 방향 접근과 동일하게 처리) */
  const rowAnchors = pairs
    .map((pair) => pair.left ?? pair.right)
    .filter((anchor): anchor is RowSnapshot => anchor !== undefined)

  if (pointerX < leftColumn.left + WEST_ZONE_WIDTH && rowAnchors.length > 0) {
    const nearestAnchor = rowAnchors.reduce((closest, anchor) =>
      Math.abs(pointerY - (anchor.rect.top + anchor.rect.bottom) / 2) <
      Math.abs(pointerY - (closest.rect.top + closest.rect.bottom) / 2)
        ? anchor
        : closest,
    )
    return { itemId: nearestAnchor.id, insertAfter: false, line: insertBeforeLine(nearestAnchor) }
  }

  const candidates: Candidate[] = []

  /* 각 행 안에서: 꽉 찼으면 두 카드 사이 세로선, 1개면 옆에 채우는 세로선 */
  pairs.forEach((pair) => {
    const center = (pairTop(pair) + pairBottom(pair)) / 2

    if (pair.left && pair.right) {
      candidates.push({
        center,
        result: {
          itemId: pair.right.id,
          insertAfter: false,
          line: {
            top: pair.right.rect.top,
            left: boundaryX,
            width: LINE_THICKNESS,
            height: pair.right.rect.height,
          },
        },
      })
      return
    }

    const refRow = pair.left ?? pair.right
    if (!refRow) return
    candidates.push({
      center,
      result: {
        itemId: refRow.id,
        insertAfter: true,
        line: {
          top: refRow.rect.top,
          left: boundaryX,
          width: LINE_THICKNESS,
          height: refRow.rect.height,
        },
      },
    })
  })

  /* 각 행 앞에 끼워넣기(맨 앞 포함): 그 행 첫 카드 높이만큼 세로선 */
  pairs.forEach((pair) => {
    const anchor = pair.left ?? pair.right
    if (!anchor) return
    candidates.push({
      center: anchor.rect.top - NEW_ROW_GAP - anchor.rect.height / 2,
      result: { itemId: anchor.id, insertAfter: false, line: insertBeforeLine(anchor) },
    })
  })

  /* 맨 뒤에 새 행 삽입 (마지막 행이 꽉 찼을 때만) */
  const lastPair = pairs[pairs.length - 1]
  if (lastPair.left && lastPair.right) {
    const lastBottom = pairBottom(lastPair)
    candidates.push({
      center: lastBottom + NEW_ROW_GAP + pairHeight(lastPair) / 2,
      result: {
        itemId: lastPair.right.id,
        insertAfter: true,
        line: {
          top: lastBottom + LINE_GAP,
          left: leftColumn.left,
          width: leftColumn.width,
          height: LINE_THICKNESS,
        },
      },
    })
  }

  return candidates.reduce((closest, candidate) =>
    Math.abs(pointerY - candidate.center) < Math.abs(pointerY - closest.center)
      ? candidate
      : closest,
  ).result
}
