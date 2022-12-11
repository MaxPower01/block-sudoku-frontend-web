import { useDraggable } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { BLOCK_PARAMS, PARAMS } from "../../utils/constants";
import { BlockModel } from "./models/BlockModel";
import blocks from "./utils/blocks";

export default function Block(props: {
  id: string;
  index: number;
  isHidden: boolean;
}) {
  const { id, index, isHidden } = props;
  const {
    grid: { width: gridWidth },
    block: { count },
  } = PARAMS;
  const maxBlockRows = 3;
  const maxBlockColumns = 3;
  const blockWidth = gridWidth / maxBlockColumns;
  const blockHeight = gridWidth / maxBlockRows;

  const [blockModel, setBlockModel] = useState<BlockModel>(blocks[index]);

  useEffect(() => {
    setBlockModel(blocks[index]);
  }, [index]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "block",
  });

  const style = useMemo(() => {
    if (!transform) {
      return undefined;
    }
    return {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    };
  }, [transform]);

  return (
    <div
      className="BlockOuterContainer"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: `${gridWidth / count}px`,
        height: `${gridWidth / count}px`,
        transform: transform
          ? `translateY(${BLOCK_PARAMS.translateVerticallyOnDrag}px)`
          : undefined,
        zIndex: 1,
        transition: "transform 0.1s ease",
      }}
    >
      {blockModel && (
        <div
          className="BlockInnerContainer"
          style={{
            transform: transform
              ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
              : "scale(0.75)",
            touchAction: "none",
            cursor: "grabbing",
          }}
          {...listeners}
          {...attributes}
        >
          <div
            className="Block"
            style={{
              display: isHidden ? "none" : "grid",
              gridTemplateColumns: `repeat(${blockModel.columnsCount}, 1fr)`,
              gridTemplateRows: `repeat(${blockModel.rowsCount}, 1fr)`,
            }}
            data-id={id}
            data-rows-count={blockModel.rowsCount}
            data-columns-count={blockModel.columnsCount}
            data-is-being-dragged={transform != null}
            data-block-model={JSON.stringify(blockModel)}
          >
            {blockModel.cells.map((row, rowIndex) => {
              return row.map((cell, cellIndex) => {
                const borderWidth = 1;
                const cellWidth = blockWidth / 3;
                const cellWidthWithoutBorder = cellWidth - borderWidth * 2;
                const cellHeight = blockHeight / 3;
                const cellHeightWithoutBorder = cellHeight - borderWidth * 2;
                const isAlive = cell === 1;
                return (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={`Block__Cell ${
                      isAlive ? "Block__Cell--alive" : ""
                    }`}
                    style={{
                      width: `${cellWidth}px`,
                      height: `${cellHeight}px`,
                      background: "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    data-row={rowIndex}
                    data-column={cellIndex}
                    data-width={cellWidth}
                    data-height={cellHeight}
                  >
                    <div
                      className="Cell__Content"
                      style={{
                        width: `calc(100% - ${borderWidth * 2}px)`,
                        height: `calc(100% - ${borderWidth * 2}px)`,
                        padding: `${borderWidth}px`,
                        borderRadius: "8px",
                      }}
                    ></div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
}
