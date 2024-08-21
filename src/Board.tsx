import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WordValidator } from "./algorithm/WordValidator";
import { Board as BoardModel } from "./models/Board";
import "./Board.css";
import { MoveValidator } from "./algorithm/MoveValidator";
import { Coordinate } from "./models/Coordinate";

interface BoardProps {
  board: BoardModel;
  wordValidator: WordValidator;
  setUserWords: Dispatch<SetStateAction<string[]>>;
  moveValidator: MoveValidator;
}

enum SubmissionMethod {
  SWIPE,
  ENTER,
  CLICK,
}

// WordValidator is undefined
const Board: React.FC<BoardProps> = ({
  board,
  wordValidator,
  setUserWords,
  moveValidator,
}) => {
  const [highlightedCells, setHighlightedCells] = useState<Coordinate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [submissionMethod, setSubmissionMethod] =
    useState<SubmissionMethod | null>();

  const boardLetters = board.getLetters();
  const boardSize = boardLetters.length;

  const handleTileClick = (row: number, col: number) => {
    if (isSearching) {
      setSubmissionMethod(SubmissionMethod.CLICK);
      submitWord();
      return;
    }
    setIsSearching(true);
    setSubmissionMethod(null);
    highlightCell(row, col);
    setHighlightedCells([new Coordinate(row, col)]);
  };

  const handlePointerEnter = (row: number, col: number) => {
    if (!isSearching || submissionMethod === SubmissionMethod.CLICK) {
      // Do nothing if we're not in search mode
      return;
    }
    setHighlightedCells((prev: Coordinate[]) => {
      const prevCell = prev[prev.length - 1]; // Check for most recent square so you don't enter twice
      const lastCell = prev[prev.length - 2]; // Check for previous location to allow backtracking
      const newCoord = new Coordinate(row, col);

      if (!moveValidator.isAdjacent(prevCell, newCoord)) {
        return prev;
      } else if (lastCell?.equals(newCoord)) {
        // Backtracking. Remove the head if we went back to an old tile
        const prevCell = prev[prev.length - 1];

        const cellElement = document.querySelector(
          `.board-cell[data-row='${prevCell.xCoord}'][data-col='${prevCell.yCoord}']`
        );
        if (cellElement) {
          cellElement.classList.remove("highlight");
        }
        return prev.slice(0, -1);
      } else if (prevCell.equals(newCoord)) {
        return prev;
      } else {
        // Add the new cell to the highlighted list
        // TODO: Don't highlight already visited if visited. Below doesn't work, not debugged
        highlightedCells.forEach((cell) => {
          if (cell.equals(newCoord)) {
            return prev;
          }
        });

        // Go this way once I use Coordinate and have the equals function
        // if (highlightedCells.includes({row, col})) {
        //   return prev;
        // }
        highlightCell(row, col);
        return [...prev, newCoord];
      }
    });
  };

  // Need a special function for highlighting cells because the mouse event happens on the child element
  const highlightCell = (row: number, col: number) => {
    const cellElement = document.querySelector(
      `.board-cell[data-row='${row}'][data-col='${col}']`
    );
    if (cellElement) {
      cellElement.classList.add("highlight");
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      submitWord();
      setSubmissionMethod(SubmissionMethod.ENTER);
    }
  };

  const submitWord = () => {
    const highlightedLetters = highlightedCells.map(
      (cell) => boardLetters[cell.xCoord][cell.yCoord]
    );
    const highlightedWord = highlightedLetters.join("");
    const isValidWord = wordValidator.check(highlightedWord);
    // Need to prevent double submits
    if (isValidWord) {
      setUserWords((prev) => {
        if (!prev.includes(highlightedWord)) {
          return [...prev, highlightedWord];
        }
        return prev;
      });
    }

    document.querySelectorAll(".highlight").forEach((element) => {
      element.classList.remove("highlight");
    });
    setHighlightedCells([]);
    setIsSearching(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [highlightedCells]);

  return (
    <>
      <div className="board">
        {Array.from({ length: boardSize }).map((_, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {Array.from({ length: boardSize }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`board-cell`}
                data-row={rowIndex}
                data-col={colIndex}
              >
                <div
                  className="board-text"
                  data-row={rowIndex}
                  data-col={colIndex}
                  onPointerEnter={() => handlePointerEnter(rowIndex, colIndex)}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                >
                  {boardLetters[rowIndex][colIndex] === "QU"
                    ? "Qu"
                    : boardLetters[rowIndex][colIndex]}{" "}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Board;
