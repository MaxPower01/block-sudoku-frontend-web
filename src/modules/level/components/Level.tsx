import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PARAMS } from "../../../utils/constants";
import { selectHighestScore, updateHighestScore } from "../../app/state/slice";
import Block from "../../block/Block";
import BlockModel from "../../block/models/BlockModel";
import getRandomIndexes from "../../block/utils/getRandomIndexes";
import hideBlock from "../../block/utils/hideBlock";
import Grid from "../../grid/components/Grid";
import GridModel from "../../grid/models/GridModel";
import { selectLevelState, updateLevelState } from "../state/slice";
import checkIfGameIsOver from "../utils/checkIfGameIsOver";
import showBlocks from "../utils/showBlocks";
import GameOverDialog from "./GameOverDialog";

export default function Level() {
  const levelState = useSelector(selectLevelState);
  const highestScore = useSelector(selectHighestScore);

  const [grid, setGrid] = useState<GridModel | null>(
    new GridModel({ cells: levelState.gridCells })
  );

  const [draggedBlock, setDraggedBlock] = useState<BlockModel | null>(null);

  const [blockIndexes, setBlockIndexes] = useState<number[]>(
    levelState.blockIndexes
  );
  const [hiddenBlockIds, setHiddenBlockIds] = useState(
    levelState.hiddenBlockIds
  );

  const hiddenBlocksCount = useMemo(
    () => hiddenBlockIds.length,
    [hiddenBlockIds]
  );

  const [score, setScore] = useState(levelState.score);

  const dispatch = useDispatch();

  const [isGameOver, setIsGameOver] = useState(false);
  const [isHighestScore, setIsHighestScore] = useState(
    levelState.isHighestScore
  );

  const handleGameOver = useCallback((isGameOver: boolean) => {
    if (isGameOver) setIsGameOver(true);
  }, []);

  useEffect(() => {
    if (hiddenBlockIds.length > 0) {
      hiddenBlockIds.forEach((id) => {
        const blockElement = document.querySelectorAll(
          `.Block[data-id="${id}"]`
        )[0] as HTMLElement | undefined;
        hideBlock({ element: blockElement });
      });
    }
    const gridElement = document.querySelector(`#Grid`) as HTMLElement | null;
    const newGrid = GridModel.from({ element: gridElement });
    if (!newGrid) {
      setGrid(null);
    } else {
      checkIfGameIsOver({ grid: newGrid })
        .then((isGameOver) => {
          handleGameOver(isGameOver);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent, id: string) => {
      const gridElement = document.querySelector(`#Grid`) as HTMLElement | null;
      const newGrid = GridModel.from({ element: gridElement });
      if (!newGrid) {
        setGrid(null);
        return;
      }

      newGrid.resetAnimationProperties();
      setGrid(newGrid);

      const blockElement = document.querySelector(
        `.Block[data-id="${id}"]`
      ) as HTMLElement | null;
      const newDraggedBlock = BlockModel.from({ element: blockElement });
      const isHidden =
        newDraggedBlock?.id != null &&
        hiddenBlockIds.includes(newDraggedBlock.id);
      if (!newDraggedBlock || isHidden) {
        setDraggedBlock(null);
        return;
      }

      setDraggedBlock(newDraggedBlock);
    },
    [hiddenBlockIds]
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent, id: string) => {
      if (!grid || !draggedBlock) return;
      grid.setHoveredCells({ blockModel: draggedBlock });
      grid.setHighlightedCells();
    },
    [grid, draggedBlock]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent, id: string) => {
      if (!grid || !draggedBlock) return;

      const { scoreIncrement } = grid.setFilledCells();

      let newScore = score;
      let newBlockIndexes = [...blockIndexes];
      let newHiddenBlockIds = [...hiddenBlockIds];
      let newIsHighestScore = levelState.isHighestScore;

      if (scoreIncrement > 0) {
        hideBlock({ element: draggedBlock.element });

        newScore = score + scoreIncrement;
        setScore(newScore);
        if (newScore > highestScore) {
          newIsHighestScore = true;
          setIsHighestScore(newIsHighestScore);
          dispatch(updateHighestScore(newScore));
        }

        const newHiddenBlocksCount = hiddenBlocksCount + 1;
        if (newHiddenBlocksCount === PARAMS.block.count) {
          newBlockIndexes = getRandomIndexes(3);
          setBlockIndexes(newBlockIndexes);

          newHiddenBlockIds = [];
          setHiddenBlockIds(newHiddenBlockIds);

          showBlocks({
            blocks: document.querySelectorAll(
              `.Block`
            ) as NodeListOf<HTMLElement>,
          });
        } else {
          if (draggedBlock.id != null) {
            newHiddenBlockIds.push(draggedBlock.id);
          }
          setHiddenBlockIds(newHiddenBlockIds);
        }
      }

      const { cells: newGridCells } = grid.updateCells();

      checkIfGameIsOver({ grid })
        .then((isGameOver) => {
          handleGameOver(isGameOver);
        })
        .catch((error) => {
          console.error(error);
        });

      dispatch(
        updateLevelState({
          score: newScore,
          isHighestScore: newIsHighestScore,
          blockIndexes: newBlockIndexes,
          gridCells: newGridCells,
          hiddenBlockIds: newHiddenBlockIds,
        })
      );
    },
    [
      grid,
      draggedBlock,
      score,
      highestScore,
      dispatch,
      hiddenBlocksCount,
      hiddenBlockIds,
      blockIndexes,
    ]
  );

  return (
    <>
      {isGameOver ? (
        <GameOverDialog score={score} isHighestScore={isHighestScore} />
      ) : null}

      <Stack spacing={2}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ width: "100%" }}
        >
          <Stack>
            <Typography variant="body2" textAlign={"center"}>
              Votre score
            </Typography>
            <Typography variant="h4" textAlign={"center"}>
              {score}
            </Typography>
          </Stack>
          <Stack justifyContent={"center"}>
            <Typography variant="body2" textAlign={"center"}>
              Record
            </Typography>
            <Typography variant="h4" textAlign={"center"}>
              {highestScore}
            </Typography>
          </Stack>
        </Stack>
        <Grid cells={levelState.gridCells} />
        <Box
          className="Blocks"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {blockIndexes.map((blockIndex, i) => (
            <DndContext
              key={i}
              onDragStart={(e) => handleDragStart(e, `${i}`)}
              onDragMove={(e) => handleDragMove(e, `${i}`)}
              onDragEnd={(e) => handleDragEnd(e, `${i}`)}
            >
              <Block
                id={`${i}`}
                index={blockIndex}
                isHidden={hiddenBlockIds.includes(i)}
              />
            </DndContext>
          ))}
        </Box>
      </Stack>
    </>
  );
}
