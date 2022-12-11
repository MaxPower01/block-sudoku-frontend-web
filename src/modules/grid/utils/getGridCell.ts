import GridCell from "../models/GridCell";

export default function getGridCell(params: {
  element: HTMLElement;
}): GridCell {
  const { element } = params;
  const _row = element.getAttribute("data-row");
  const _column = element.getAttribute("data-column");
  const _box = element.getAttribute("data-box");
  const _filled = element.getAttribute("data-filled");
  const _rowHighlighted = element.getAttribute("data-row-highlighted");
  const _columnHighlighted = element.getAttribute("data-column-highlighted");
  const _boxHighlighted = element.getAttribute("data-box-highlighted");
  const row = _row ? parseInt(_row) : -1;
  const column = _column ? parseInt(_column) : -1;
  const box = _box ? parseInt(_box) : -1;
  const rowHighlighted = _rowHighlighted === "true" ? true : false;
  const columnHighlighted = _columnHighlighted === "true" ? true : false;
  const boxHighlighted = _boxHighlighted === "true" ? true : false;
  const isHighlighted = rowHighlighted || columnHighlighted || boxHighlighted;
  const filled = isHighlighted || _filled != "true" ? false : true;
  return {
    row,
    column,
    box: box,
    filled,
  };
}
