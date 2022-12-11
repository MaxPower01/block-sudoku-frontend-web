import { BlockShape } from "../../../utils/enums";
import GridModel from "../../grid/models/GridModel";
import BlockCell from "./BlockCell";

export class BlockModel {
  public readonly name: string;
  public readonly shape: BlockShape;
  public readonly cells: number[][];
  public readonly parsedCells: BlockCell[];

  public get filledParsedCells(): BlockCell[] {
    return this.parsedCells.filter((parsedCell) => parsedCell.filled);
  }

  private _id?: number;
  public get id(): number | undefined {
    return this._id;
  }

  private _element?: HTMLElement;
  public get element(): HTMLElement | undefined {
    return this._element;
  }

  private _cellElements?: NodeListOf<HTMLElement>;
  public get cellElements(): NodeListOf<HTMLElement> | undefined {
    return this._cellElements;
  }

  private _cellElementsAlive?: NodeListOf<HTMLElement>;
  public get cellElementsAlive(): NodeListOf<HTMLElement> | undefined {
    return this._cellElementsAlive;
  }

  private _cellElementsDead?: NodeListOf<HTMLElement>;
  public get cellElementsDead(): NodeListOf<HTMLElement> | undefined {
    return this._cellElementsDead;
  }

  public get rowsCount(): number {
    if (!this.cells) return 0;
    return this.cells.length;
  }

  public get isHidden(): boolean {
    if (!this.element) return false;
    return this.element.getAttribute("data-is-hidden") === "true";
  }

  public get columnsCount(): number {
    if (!this.cells) return 0;
    const rowWithHighestCellsCount = this.cells.reduce(
      (prev, curr) => (prev.length > curr.length ? prev : curr),
      []
    );
    return rowWithHighestCellsCount.length;
  }

  constructor(params: { name: string; shape: BlockShape; cells: number[][] }) {
    this.name = params.name;
    this.shape = params.shape;
    this.cells = params.cells;
    const blockCellsParsed: BlockCell[] = [];
    this.cells.forEach((blockCellRow, blockCellRowIndex) => {
      const row = blockCellRowIndex;
      blockCellRow.forEach((blockCellColumn, blockCellColumnIndex) => {
        const column = blockCellColumnIndex;
        const filled = blockCellColumn === 1;
        blockCellsParsed.push({ row, column, box: 0, filled });
      });
    });
    this.parsedCells = blockCellsParsed;
  }

  static from(params: { element: HTMLElement | null }): BlockModel | null {
    const { element } = params;
    if (!element) return null;
    const serializedBlock = element.getAttribute("data-block-model");
    if (!serializedBlock) return null;
    const block = BlockModel.deserialize(serializedBlock);
    block.bindElement(element);
    return block;
  }

  static deserialize(blockModelSerialized: string): BlockModel {
    const blockModel = JSON.parse(blockModelSerialized) as BlockModel;
    return new BlockModel({
      name: blockModel.name,
      shape: blockModel.shape,
      cells: blockModel.cells,
    });
  }

  public bindElement(element: HTMLElement): void {
    this._element = element;
    this._cellElements = element.querySelectorAll(".Block__Cell");
    this._cellElementsAlive = element.querySelectorAll(".Block__Cell--alive");
    this._cellElementsDead = element.querySelectorAll(
      ".Block__Cell:not(.Block__Cell--alive)"
    );
    const id = parseInt(element.getAttribute("data-id") || "-1");
    this._id = id > -1 ? id : undefined;
  }

  public fitsInGrid(grid: GridModel): boolean {
    const { cells: gridCells } = grid;
    if (!gridCells) return false;

    const emptyGridCells = gridCells.filter(
      (gridCell) => gridCell.filled == false
    );
    if (!emptyGridCells) return false;

    let fits = false;

    const { filledParsedCells: filledBlockCells } = this;

    const firstFilledBlockCell = filledBlockCells[0];

    emptyGridCells.forEach((emptyGridCell) => {
      if (fits) return;

      const currentGridCellRow = emptyGridCell.row;
      const currentGridCellColumn = emptyGridCell.column;

      let previousBlockRow = firstFilledBlockCell.row;
      let previousBlockColumn = firstFilledBlockCell.column;

      let allCellsFit = true;

      filledBlockCells.forEach((blockCell) => {
        if (!allCellsFit) return;

        const currentBlockRow = blockCell.row;
        const currentBlockColumn = blockCell.column;

        let rowDifference = Math.abs(currentBlockRow - previousBlockRow);
        let columnDifference = Math.abs(
          currentBlockColumn - previousBlockColumn
        );

        if (currentBlockRow < previousBlockRow) {
          rowDifference = rowDifference * -1;
        }
        if (currentBlockColumn < previousBlockColumn) {
          columnDifference = columnDifference * -1;
        }

        const matchingGridCell = emptyGridCells.find(
          (gridCell) =>
            gridCell.row == currentGridCellRow + rowDifference &&
            gridCell.column == currentGridCellColumn + columnDifference
        );

        allCellsFit = matchingGridCell != null ? true : false;
      });

      fits = allCellsFit;
    });

    return fits;
  }
}

export default BlockModel;
