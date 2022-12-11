import BlockModel from "../../block/models/BlockModel";
import GridModel from "../../grid/models/GridModel";

export default function checkIfGameIsOver(params: {
  grid: GridModel;
}): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { grid } = params;
      const blockElements = document.querySelectorAll(
        ".Block"
      ) as NodeListOf<HTMLElement>;
      let isGameOver = true;
      blockElements.forEach((blockElement) => {
        const block = BlockModel.from({ element: blockElement });
        if (!block) return;
        const { isHidden, id } = block;
        if (isHidden) {
        } else {
          const fitsInGrid = block.fitsInGrid(grid);
          if (fitsInGrid) {
            blockElement.classList.remove("Block--invalid");
            isGameOver = false;
          } else {
            blockElement.classList.add("Block--invalid");
          }
        }
      });
      resolve(isGameOver);
    }, 100);
  });
}
