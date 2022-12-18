import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Box, Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrophySVG from "../../../assets/trophy-01.svg";
import { PARAMS } from "../../../utils/constants";
import { TimeFrame } from "../../../utils/enums";
import { selectHighScores, updateHighScores } from "../../app/state/slice";
import Block from "../../block/Block";
import BlockModel from "../../block/models/BlockModel";
import getRandomIndexes from "../../block/utils/getRandomIndexes";
import hideBlock from "../../block/utils/hideBlock";
import Grid from "../../grid/components/Grid";
import GridModel from "../../grid/models/GridModel";
import { selectLevelState, updateLevelState } from "../state/slice";
import checkIfGameOver from "../utils/checkIfGameOver";
import showBlocks from "../utils/showBlocks";
import GameOverDialog from "./GameOverDialog";

export default function Level() {
  const levelState = useSelector(selectLevelState);
  const highScores = useSelector(selectHighScores);

  const [grid, setGrid] = useState<GridModel | null>(
    new GridModel({ cells: levelState.gridCells })
  );
  Object.values(TimeFrame).forEach((timeFrame, index) => {
    console.log("timeFrame", timeFrame, index);
  });

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
  const [isHighScoreOfTimeFrame, setIsHighScoreOfTimeFrame] = useState(
    levelState.isHighScoreOfTimeFrame
  );

  const handleGameOver = useCallback((isGameOver: boolean) => {
    if (isGameOver) setIsGameOver(true);
  }, []);

  const resetAllBlocks = useCallback(() => {
    const newBlockIndexes = getRandomIndexes(3);
    setBlockIndexes(newBlockIndexes);
    const newHiddenBlockIds: number[] = [];
    setHiddenBlockIds(newHiddenBlockIds);
    showBlocks({
      blocks: document.querySelectorAll(`.Block`) as NodeListOf<HTMLElement>,
    });
    return { newBlockIndexes, newHiddenBlockIds };
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
      checkIfGameOver({ grid: newGrid })
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
      let newScoreIsHighScoreOfTimeFrame = levelState.isHighScoreOfTimeFrame;

      if (scoreIncrement > 0) {
        hideBlock({ element: draggedBlock.element });

        newScore = score + scoreIncrement;
        setScore(newScore);

        let previousTimeframeIndex = -1;
        Object.values(TimeFrame).forEach((timeFrame, timeFrameIndex) => {
          const highScoreOfTimeFrame = highScores[timeFrame];
          if (newScore > highScoreOfTimeFrame.score) {
            if (timeFrameIndex > previousTimeframeIndex) {
              newScoreIsHighScoreOfTimeFrame = timeFrame;
              setIsHighScoreOfTimeFrame(timeFrame);
            }
          }
          previousTimeframeIndex = timeFrameIndex;
        });

        dispatch(updateHighScores(newScore));

        const newHiddenBlocksCount = hiddenBlocksCount + 1;
        if (newHiddenBlocksCount === PARAMS.block.count) {
          const result = resetAllBlocks();
          newBlockIndexes = result.newBlockIndexes;
          newHiddenBlockIds = result.newHiddenBlockIds;
        } else {
          if (draggedBlock.id != null) {
            newHiddenBlockIds.push(draggedBlock.id);
          }
          setHiddenBlockIds(newHiddenBlockIds);
        }
      }

      const { cells: newGridCells } = grid.updateCells();

      checkIfGameOver({ grid })
        .then((isGameOver) => {
          handleGameOver(isGameOver);
        })
        .catch((error) => {
          console.error(error);
        });

      dispatch(
        updateLevelState({
          score: newScore,
          isHighScoreOfTimeFrame: newScoreIsHighScoreOfTimeFrame,
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
      highScores,
      dispatch,
      hiddenBlocksCount,
      hiddenBlockIds,
      blockIndexes,
    ]
  );

  return (
    <>
      {isGameOver ? (
        <GameOverDialog
          score={score}
          isHighestScoreOfTimeFrame={isHighScoreOfTimeFrame}
        />
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
              Score
            </Typography>
            <Typography variant="h4" textAlign={"center"}>
              {score}
            </Typography>
          </Stack>
          <Stack justifyContent={"center"}>
            <Typography variant="body2" textAlign={"center"}>
              <img
                src={TrophySVG}
                alt="Trophy"
                style={{
                  width: "1em",
                  height: "auto",
                  display: "inline-block",
                }}
              />
              &nbsp;Record
            </Typography>
            <Typography variant="h4" textAlign={"center"}>
              {highScores.allTime.score}
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
        <Button onClick={() => resetAllBlocks()} variant={"outlined"}>
          Réinitialiser les blocs
        </Button>
        <Button onClick={() => setIsGameOver(true)} variant={"outlined"}>
          Terminer la partie
        </Button>
      </Stack>
    </>
  );
}
