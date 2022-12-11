import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { GRID_PARAMS } from "../../../utils/constants";
import GridCell from "../models/GridCell";
import GridModel from "../models/GridModel";

export default function Grid(props: { cells: GridCell[] }) {
  const [grid, setGrid] = useState(new GridModel({ cells: props.cells }));
  const { rows, columns, width } = GRID_PARAMS;
  useEffect(() => {
    const gridElement = document.querySelector(`#Grid`) as HTMLElement | null;
    if (gridElement == null) return;
    const cells = gridElement.querySelectorAll(".Grid__Cell");
    cells.forEach((cell) => {
      cell.setAttribute("xyz", "fade small ease-in-out duration");
    });
  }, []);
  return (
    <Box
      id="Grid"
      className="GridContainer"
      sx={{
        position: "relative",
      }}
    >
      <Box
        className="Grid"
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: `${width}px`,
          height: `${width}px`,
          margin: "0 auto",
        }}
      >
        {grid.cells
          ? grid.cells.map((cell) => {
              const { row, column, box, filled } = cell;
              const cellWidth = width / columns;
              const cellHeight = width / rows;
              const borderWidth = 1;
              const cellIsAlternateSubGrid = box % 2 !== 0;
              const className = `Grid__Cell ${
                cellIsAlternateSubGrid ? "Grid__Cell--alternate-box" : ""
              }`;
              return (
                <Box
                  key={`row-${row}-column-${column}`}
                  className={className}
                  style={{
                    width: `${cellWidth}px`,
                    height: `${cellHeight}px`,
                    background: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                  data-row={row}
                  data-column={column}
                  data-box={box}
                  data-filled={filled}
                  data-row-highlighted={false}
                  data-column-highlighted={false}
                  data-box-highlighted={false}
                >
                  <Box
                    className="Cell__Content Cell__Content--back-layer"
                    sx={{
                      width: `calc(100% - ${borderWidth * 2}px)`,
                      height: `calc(100% - ${borderWidth * 2}px)`,
                      padding: `${borderWidth}px`,
                      borderRadius: "8px",
                    }}
                  />
                  <Box
                    className="Cell__Content Cell__Content--front-layer"
                    sx={{
                      width: `calc(100% - ${borderWidth * 2}px)`,
                      height: `calc(100% - ${borderWidth * 2}px)`,
                      padding: `${borderWidth}px`,
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              );
            })
          : null}
      </Box>
    </Box>
  );
}
