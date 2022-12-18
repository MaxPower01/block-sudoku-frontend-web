import { GRID_PARAMS } from "../../../utils/constants";
import BlockModel from "../../block/models/BlockModel";
import getGridCell from "../utils/getGridCell";
import GridCell from "./GridCell";
import GridRegion from "./GridRegion";

export class GridModel {
  private _cells: GridCell[] | undefined;
  public get cells(): GridCell[] | undefined {
    return this._cells;
  }

  private _element: HTMLElement | undefined;
  public get element(): HTMLElement | undefined {
    return this._element;
  }

  private _domRect: DOMRect | undefined;
  public get domRect(): DOMRect | undefined {
    return this._domRect;
  }

  private _cellElements: NodeListOf<HTMLElement> | undefined;
  public get cellElements(): NodeListOf<HTMLElement> | undefined {
    return this._cellElements;
  }

  // private _emptyCellElements: NodeListOf<HTMLElement> | undefined;
  // public get emptyCellElements(): NodeListOf<HTMLElement> | undefined {
  //   return this._emptyCellElements;
  // }

  private _activeCellElements: NodeListOf<HTMLElement> | undefined;
  public get activeCellElements(): NodeListOf<HTMLElement> | undefined {
    return this._activeCellElements;
  }

  private _rows: Array<GridRegion> | undefined;
  public get rows(): Array<GridRegion> | undefined {
    return this._rows;
  }

  private _columns: Array<GridRegion> | undefined;
  public get columns(): Array<GridRegion> | undefined {
    return this._columns;
  }

  private _boxes: Array<GridRegion> | undefined;
  public get boxes(): Array<GridRegion> | undefined {
    return this._boxes;
  }

  constructor(params?: { cells: GridCell[] }) {
    const { cells } = params || {};
    if (cells && cells.length) {
      this._cells = cells;
    } else {
      const { rows, columns } = GRID_PARAMS;
      this._cells = Array.from({ length: rows * columns }).map((_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        let box = 8;
        if (row <= 2 && column <= 2) {
          box = 0;
        } else if (row <= 2 && column <= 5) {
          box = 1;
        } else if (row <= 2 && column <= 8) {
          box = 2;
        } else if (row <= 5 && column <= 2) {
          box = 3;
        } else if (row <= 5 && column <= 5) {
          box = 4;
        } else if (row <= 5 && column <= 8) {
          box = 5;
        } else if (row <= 8 && column <= 2) {
          box = 6;
        } else if (row <= 8 && column <= 5) {
          box = 7;
        }
        return {
          row,
          column,
          box,
          filled: false,
        };
      });
    }
  }

  static from(params: { element: HTMLElement | null }): GridModel | null {
    const { element } = params;
    if (!element) return null;
    const grid = new GridModel();
    grid.bindElement(element);
    return grid;
  }

  private bindElement(element: HTMLElement) {
    this._element = element;
    this._domRect = element.getBoundingClientRect();
    this._cellElements = element.querySelectorAll(".Grid__Cell");
    // this._emptyCellElements = element.querySelectorAll(".Grid__Cell--empty");
    this._activeCellElements = element.querySelectorAll(".Grid__Cell--active");
    const { rows, columns, boxes } = this.getRegions();
    this._rows = rows;
    this._columns = columns;
    this._boxes = boxes;
    if (this.cellElements?.length) {
      this._cells = Array.from(this.cellElements).map((cellElement) => {
        return getGridCell({ element: cellElement });
      });
    }
  }

  private getRegions(): {
    rows: Array<GridRegion>;
    columns: Array<GridRegion>;
    boxes: Array<GridRegion>;
  } {
    if (!this.element || !this.domRect)
      return { rows: [], columns: [], boxes: [] };

    const rows: Array<GridRegion> = [];
    const columns: Array<GridRegion> = [];
    const boxes: Array<GridRegion> = [];
    const {
      rows: gridRows,
      columns: gridColumns,
      boxRows: boxRows,
      boxColumns: boxColumns,
    } = GRID_PARAMS;
    if (gridRows !== gridColumns) {
      throw new Error("Grid rows and columns must be equal");
    }
    const gridSize = gridRows;
    for (let i = 0; i < gridSize; i++) {
      const rowCells = this.element.querySelectorAll(
        `.Grid__Cell[data-row="${i}"]`
      ) as NodeListOf<HTMLElement>;
      const columnCells = this.element.querySelectorAll(
        `.Grid__Cell[data-column="${i}"]`
      ) as NodeListOf<HTMLElement>;
      const boxCells = this.element.querySelectorAll(
        `.Grid__Cell[data-box="${i}"]`
      ) as NodeListOf<HTMLElement>;
      const firstRowCell = rowCells[0];
      const firstColumnCell = columnCells[0];
      const firstBoxCell = boxCells[0];
      const firstRowCellRect = firstRowCell.getBoundingClientRect();
      const firstColumnCellRect = firstColumnCell.getBoundingClientRect();
      const firstBoxCellRect = firstBoxCell.getBoundingClientRect();
      const { x: rowX, y: rowY, height: cellHeight } = firstRowCellRect;
      const { x: columnX, y: columnY, width: cellWidth } = firstColumnCellRect;
      const { x: boxX, y: boxY } = firstBoxCellRect;
      const rowRect = new DOMRect(rowX, rowY, this.domRect.width, cellHeight);
      const columnRect = new DOMRect(
        columnX,
        columnY,
        cellWidth,
        this.domRect.height
      );
      const boxRect = new DOMRect(
        boxX,
        boxY,
        cellWidth * boxColumns,
        cellHeight * boxRows
      );
      rows.push({
        domRect: rowRect,
        cells: rowCells,
      });
      columns.push({
        domRect: columnRect,
        cells: columnCells,
      });
      boxes.push({
        domRect: boxRect,
        cells: boxCells,
      });
    }
    return {
      rows,
      columns,
      boxes: boxes,
    };
  }

  public setFilledCells(): {
    scoreIncrement: number;
  } {
    if (!this.cellElements) return { scoreIncrement: 0 };

    const hoveredCellsToAnimate: HTMLElement[] = [];
    const highlightedCellsToAnimate: HTMLElement[] = [];

    let scoreIncrement = 0;

    this.cellElements.forEach((cell) => {
      const isHovered = cell.classList.contains("Grid__Cell--hovered");
      const isHighlighted = cell.classList.contains("Grid__Cell--highlighted");

      if (isHovered) {
        cell.classList.remove("Grid__Cell--hovered");
        cell.setAttribute("data-filled", "true");
        if (this.cells) {
          const { row, column, box: box } = getGridCell({ element: cell });
          const cellIndex = this.cells.findIndex(
            (cell) =>
              cell.row === row && cell.column === column && cell.box === box
          );
          this.cells[cellIndex].filled = true;
        }
        if (!isHighlighted) {
          hoveredCellsToAnimate.push(cell);
        }
        scoreIncrement++;
      }
      if (isHighlighted) {
        highlightedCellsToAnimate.push(cell);
        scoreIncrement++;
      }
    });

    if (hoveredCellsToAnimate.length > 0) {
      hoveredCellsToAnimate.forEach((cell, index) => {
        // cell.classList.add("xyz-in");
      });
    }

    if (highlightedCellsToAnimate.length > 0) {
      this.triggerAnimationOn({
        cells: highlightedCellsToAnimate,
        scoreIncrement,
      });
    }

    return {
      scoreIncrement,
    };
  }

  private triggerAnimationOn(params: {
    cells: HTMLElement[];
    scoreIncrement: number;
  }) {
    const { cells, scoreIncrement } = params;
    const delay = 25;
    const totalAnimationDuration = cells.length * delay;
    const middleIndex = Math.floor(cells.length / 2);
    const middleCell = cells[middleIndex];
    const snackbarElement = document.createElement("div");

    cells.forEach((cell, index) => {
      cell.setAttribute("data-filled", "false");
      cell.classList.remove("Grid__Cell--highlighted");
      const frontLayerContent = cell.querySelector(
        ".Cell__Content--front-layer"
      ) as HTMLElement;
      const clone = frontLayerContent.cloneNode(true) as HTMLElement;
      cell.appendChild(clone);
      clone.style.zIndex = "2";
      clone.style.opacity = "1";
      clone.style.transition =
        "opacity 0.35s ease-in-out, transform 0.35s ease-in-out";
      setTimeout(() => {
        clone.style.transform = "translate(-50%, -50%) scale(0.5)";
        clone.style.opacity = "0";
        setTimeout(() => {
          cell.removeChild(clone);
        }, 350);
      }, index * delay);
    });

    setTimeout(() => {
      snackbarElement.classList.add("ScoreUpdateSnackbar");
      snackbarElement.innerText = `+${scoreIncrement}`;
      middleCell.appendChild(snackbarElement);

      const showDelay = delay;
      const hideDelay = 1000;

      setTimeout(() => {
        snackbarElement.classList.add("ScoreUpdateSnackbar--visible");
      }, showDelay);

      setTimeout(() => {
        snackbarElement.classList.add("ScoreUpdateSnackbar--hidden");
        snackbarElement.classList.remove("ScoreUpdateSnackbar--visible");

        setTimeout(() => {
          middleCell.removeChild(snackbarElement);
        }, 500);
      }, hideDelay + showDelay);
    }, totalAnimationDuration);
  }

  public setHighlightedCells() {
    const { rows, columns, boxes: boxes } = this;

    if (!rows || !columns || !boxes) return;

    rows.forEach((row, rowIndex) => {
      const { cells } = row;
      let hoveredOrFilledCellsCount = 0;
      cells.forEach((cell, cellIndex) => {
        const isHoveredOrFilled =
          cell.classList.contains("Grid__Cell--hovered") ||
          cell.getAttribute("data-filled") === "true";
        if (isHoveredOrFilled) hoveredOrFilledCellsCount++;
      });
      if (hoveredOrFilledCellsCount === cells.length) {
        cells.forEach((cell) => {
          cell.classList.add("Grid__Cell--highlighted");
          cell.setAttribute("data-row-highlighted", "true");
        });
      } else {
        cells.forEach((cell) => {
          cell.classList.remove("Grid__Cell--highlighted");
          cell.setAttribute("data-row-highlighted", "false");
        });
      }
    });

    columns.forEach((column, columnIndex) => {
      const { cells } = column;
      let hoveredOrFilledCellsCount = 0;
      cells.forEach((cell, cellIndex) => {
        const isHoveredOrFilled =
          cell.classList.contains("Grid__Cell--hovered") ||
          cell.getAttribute("data-filled") === "true";
        if (isHoveredOrFilled) hoveredOrFilledCellsCount++;
      });
      if (hoveredOrFilledCellsCount === cells.length) {
        cells.forEach((cell) => {
          cell.classList.add("Grid__Cell--highlighted");
          cell.setAttribute("data-column-highlighted", "true");
        });
      } else {
        cells.forEach((cell) => {
          if (cell.getAttribute("data-row-highlighted") == "true") return;
          cell.classList.remove("Grid__Cell--highlighted");
          cell.setAttribute("data-column-highlighted", "false");
        });
      }
    });

    boxes.forEach((box, boxIndex) => {
      const { cells } = box;
      let hoveredOrFilledCellsCount = 0;
      cells.forEach((cell, cellIndex) => {
        const isHoveredOrFilled =
          cell.classList.contains("Grid__Cell--hovered") ||
          cell.getAttribute("data-filled") === "true";
        if (isHoveredOrFilled) hoveredOrFilledCellsCount++;
      });
      if (hoveredOrFilledCellsCount === cells.length) {
        cells.forEach((cell) => {
          cell.classList.add("Grid__Cell--highlighted");
          cell.setAttribute("data-box-highlighted", "true");
        });
      } else {
        cells.forEach((cell) => {
          if (
            cell.getAttribute("data-row-highlighted") == "true" ||
            cell.getAttribute("data-column-highlighted") == "true"
          )
            return;
          cell.classList.remove("Grid__Cell--highlighted");
          cell.setAttribute("data-box-highlighted", "false");
        });
      }
    });
  }

  public setHoveredCells(params: { blockModel: BlockModel }) {
    const {
      element: gridElement,
      domRect: gridDomRect,
      cellElements: gridCells,
      rows: gridRows,
      columns: gridColumns,
    } = this;

    if (!gridCells || !gridDomRect || !gridColumns || !gridRows || !gridElement)
      return;

    const {
      blockModel: {
        element: block,
        cellElements: blockCells,
        cellElementsAlive: blockCellsAlive,
      },
    } = params;

    if (
      !block ||
      !blockCells ||
      !blockCells.length ||
      !gridCells.length ||
      !blockCellsAlive
    )
      return;

    const {
      top: gridTop,
      left: gridLeft,
      bottom: gridBottom,
      right: gridRight,
    } = gridDomRect;

    const { width: blockCellWidth, height: blockCellHeight } =
      blockCells[0].getBoundingClientRect();

    const halfBlockCellWidth = blockCellWidth / 2;
    const halfBlockCellHeight = blockCellHeight / 2;

    const blockDomRect = block.getBoundingClientRect();

    // let { x, y, width, height } = blockDomRect;
    // y += BLOCK_PARAMS.translateVerticallyOnDrag;
    // blockDomRect = new DOMRect(x, y, width, height);

    const firstActiveBlockCell = blockCellsAlive[0];
    const firstActiveBlockCellDomRect =
      firstActiveBlockCell.getBoundingClientRect();
    const {
      top: firstBlockFilledCellTop,
      left: firstBlockFilledCellLeft,
      bottom: firstBlockFilledCellBottom,
      right: firstBlockFilledCellRight,
    } = firstActiveBlockCellDomRect;

    const {
      top: blockTop,
      left: blockLeft,
      bottom: blockBottom,
      right: blockRight,
    } = blockDomRect;

    const halfGridCellWidth = gridColumns[0].domRect.width / 2;
    const halfGridCellHeight = gridRows[0].domRect.height / 2;

    const blockIsWithinGrid =
      blockTop + halfBlockCellHeight >= gridTop &&
      blockBottom - halfBlockCellHeight <= gridBottom &&
      blockLeft + halfBlockCellWidth >= gridLeft &&
      blockRight - halfBlockCellWidth <= gridRight;

    if (!blockIsWithinGrid) {
      gridElement.querySelectorAll(`.Grid__Cell`).forEach((cell) => {
        cell.classList.remove("Grid__Cell--hovered");
        cell.classList.remove("Grid__Cell--highlighted");
      });
      return;
    }

    let firstHoveredGridCell: HTMLElement | undefined;
    const nonHoveredGridCells: Array<HTMLElement> = [];

    gridRows.forEach((row, rowId) => {
      const { top: rowTop, bottom: rowBottom } = row.domRect;
      const rowIsHovered =
        rowTop + halfGridCellWidth > firstBlockFilledCellTop &&
        rowBottom - halfGridCellHeight < firstBlockFilledCellBottom;
      row.cells.forEach((cell) => {
        if (!rowIsHovered) {
          nonHoveredGridCells.push(cell);
          return;
        }
        const column =
          gridColumns[cell.getAttribute("data-column") as unknown as number];
        const columnRect = column.domRect;
        const { left: columnLeft, right: columnRight } = columnRect;
        const columnIsHovered =
          columnLeft + halfGridCellWidth > firstBlockFilledCellLeft &&
          columnRight - halfGridCellWidth < firstBlockFilledCellRight;
        if (columnIsHovered) {
          firstHoveredGridCell = cell;
        } else {
          nonHoveredGridCells.push(cell);
        }
      });
    });

    nonHoveredGridCells.forEach((cell) => {
      cell.classList.remove("Grid__Cell--hovered");
    });

    if (firstHoveredGridCell == null) return;

    const firstBlockFilledCellRowId = Number(
      firstActiveBlockCell.getAttribute("data-row")
    );
    const firstBlockFilledCellColumnId = Number(
      firstActiveBlockCell.getAttribute("data-column")
    );
    const firstHoveredGridCellRowId = Number(
      firstHoveredGridCell.getAttribute("data-row")
    );
    const firstHoveredGridCellColumnId = Number(
      firstHoveredGridCell.getAttribute("data-column")
    );

    let hoveredGridCells: Array<HTMLElement> = [];

    blockCellsAlive.forEach((cell) => {
      let matchingGridRowId = firstHoveredGridCellRowId;
      let matchingGridColumnId = firstHoveredGridCellColumnId;
      const rowId = Number(cell.getAttribute("data-row"));
      const columnId = Number(cell.getAttribute("data-column"));

      if (rowId !== firstBlockFilledCellRowId) {
        matchingGridRowId += rowId - firstBlockFilledCellRowId;
      }
      if (columnId !== firstBlockFilledCellColumnId) {
        matchingGridColumnId += columnId - firstBlockFilledCellColumnId;
      }
      const matchingGridCell = gridElement.querySelector(
        `[data-row="${matchingGridRowId}"][data-column="${matchingGridColumnId}"]`
      ) as HTMLElement | null;
      if (matchingGridCell == null) return;
      if (matchingGridCell.getAttribute("data-filled") == "true") return;
      hoveredGridCells.push(matchingGridCell);
    });

    if (hoveredGridCells.length !== blockCellsAlive.length) return;

    hoveredGridCells.forEach((cell) => {
      cell.classList.add("Grid__Cell--hovered");
    });
  }

  public resetAnimationProperties(): void {
    const { cellElements: cells } = this;
    if (!cells) return;
    cells.forEach((cell) => {
      cell.classList.remove("xyz-in");
      cell.setAttribute("xyz", "fade small ease-in-out duration");
    });
  }

  public updateCells(): { cells: Array<GridCell> } {
    const { cellElements } = this;
    if (!cellElements) return { cells: [] };
    const newCells = Array.from(cellElements).map((cellElement) => {
      return getGridCell({ element: cellElement });
    });
    this._cells = newCells;
    return {
      cells: this._cells,
    };
  }
}

export default GridModel;
