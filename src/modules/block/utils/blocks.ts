import { BlockShape } from "../../../utils/enums";
import BlockModel from "../models/BlockModel";

const cubes: Array<BlockModel> = [
  new BlockModel({
    name: "cube-1x1",
    shape: BlockShape.Square,
    cells: [[1]],
  }),
  new BlockModel({
    name: "cube-2x2",
    shape: BlockShape.Square,
    cells: [
      [1, 1],
      [1, 1],
    ],
  }),
  new BlockModel({
    name: "cube-2x2",
    shape: BlockShape.Square,
    cells: [
      [1, 1],
      [1, 1],
    ],
  }),
];

const straightLines: Array<BlockModel> = [
  new BlockModel({
    name: "straight-line-1x2",
    shape: BlockShape.StraightLine,
    cells: [[1, 1]],
  }),
  new BlockModel({
    name: "straight-line-2x1",
    shape: BlockShape.StraightLine,
    cells: [[1], [1]],
  }),
  new BlockModel({
    name: "straight-line-1x3",
    shape: BlockShape.StraightLine,
    cells: [[1, 1, 1]],
  }),
  new BlockModel({
    name: "straight-line-3x1",
    shape: BlockShape.StraightLine,
    cells: [[1], [1], [1]],
  }),
];

const diagonalLines: Array<BlockModel> = [
  new BlockModel({
    name: "diagonal-line-2x2-tl-br",
    shape: BlockShape.DiagonalLine,
    cells: [
      [1, 0],
      [0, 1],
    ],
  }),
  new BlockModel({
    name: "diagonal-line-2x2-tr-bl",
    shape: BlockShape.DiagonalLine,
    cells: [
      [0, 1],
      [1, 0],
    ],
  }),
  new BlockModel({
    name: "diagonal-line-3x3-tl-br",
    shape: BlockShape.DiagonalLine,
    cells: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  }),
  new BlockModel({
    name: "diagonal-line-3x3-tr-bl",
    shape: BlockShape.DiagonalLine,
    cells: [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ],
  }),
];

const corners: Array<BlockModel> = [
  new BlockModel({
    name: "corner-top-left-small",
    shape: BlockShape.Corner,
    cells: [
      [1, 1],
      [1, 0],
    ],
  }),
  new BlockModel({
    name: "corner-top-right-small",
    shape: BlockShape.Corner,
    cells: [
      [1, 1],
      [0, 1],
    ],
  }),
  new BlockModel({
    name: "corner-bottom-right-small",
    shape: BlockShape.Corner,
    cells: [
      [0, 1],
      [1, 1],
    ],
  }),
  new BlockModel({
    name: "corner-bottom-left-small",
    shape: BlockShape.Corner,
    cells: [
      [1, 0],
      [1, 1],
    ],
  }),
  new BlockModel({
    name: "corner-top-left-large",
    shape: BlockShape.Corner,
    cells: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
  }),
  new BlockModel({
    name: "corner-top-right-large",
    shape: BlockShape.Corner,
    cells: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
  }),
  new BlockModel({
    name: "corner-bottom-right-large",
    shape: BlockShape.Corner,
    cells: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
  }),
  new BlockModel({
    name: "corner-bottom-left-large",
    shape: BlockShape.Corner,
    cells: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
  }),
];

const ls: Array<BlockModel> = [
  new BlockModel({
    name: "l-left",
    shape: BlockShape.L,
    cells: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  }),
  new BlockModel({
    name: "l-right",
    shape: BlockShape.L,
    cells: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  }),
  new BlockModel({
    name: "l-top",
    shape: BlockShape.L,
    cells: [
      [1, 1, 1],
      [1, 0, 0],
    ],
  }),
  new BlockModel({
    name: "l-bottom",
    shape: BlockShape.L,
    cells: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  }),
  new BlockModel({
    name: "l-left-flipped",
    shape: BlockShape.L,
    cells: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
  }),
  new BlockModel({
    name: "l-right-flipped",
    shape: BlockShape.L,
    cells: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  }),
  new BlockModel({
    name: "l-top-flipped",
    shape: BlockShape.L,
    cells: [
      [1, 1, 1],
      [0, 0, 1],
    ],
  }),
  new BlockModel({
    name: "l-bottom-flipped",
    shape: BlockShape.L,
    cells: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  }),
];

const blocks: Array<BlockModel> = [
  ...cubes,
  ...straightLines,
  ...diagonalLines,
  ...corners,
  ...ls,
];

const blocksCount = blocks.length;

export {
  cubes,
  straightLines,
  diagonalLines,
  corners,
  ls,
  blocksCount,
  blocks,
};

export default blocks;
