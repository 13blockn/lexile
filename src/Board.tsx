import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WordValidator } from "./algorithm/WordValidator";
import { Board as BoardModel } from "./models/Board";
import "./Board.css";

interface BoardProps {
  board: BoardModel;
  wordValidator: WordValidator;
  setUserWords: Dispatch<SetStateAction<string[]>>;
}

// WordValidator is undefined
const Board: React.FC<BoardProps> = ({
  board,
  wordValidator,
  setUserWords,
}) => {
  const [highlightedCells, setHighlightedCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const boardLetters = board.getLetters();
  const boardSize = boardLetters.length;

  const startSearch = (row: number, col: number) => {
    setIsSearching(true);
    highlightCell(row, col);
    setHighlightedCells([{ row, col }]);
  };

  const handlePointerEnter = (row: number, col: number) => {
    if (!isSearching) {
      // Do nothing if we're not in search mode
      return;
    }
    setHighlightedCells((prev) => {
      const prevCell = prev[prev.length - 1]; // Check for most recent square so you don't enter twice
      const lastCell = prev[prev.length - 2]; // Check for previous location to allow backtracking

      // Check if the newly entered cell is the last one in the list (backtracking)
      if (lastCell && lastCell.row === row && lastCell.col === col) {
        // Remove the last cell (backtracking)
        const prevCell = prev[prev.length - 1];
        const cellElement = document.querySelector(
          `.board-cell[data-row='${prevCell.row}'][data-col='${prevCell.col}']`
        );
        if (cellElement) {
          cellElement.classList.remove("highlight");
        }
        return prev.slice(0, -1);
      } else if (prevCell && prevCell.row === row && prevCell.col === col) {
        return prev;
      } else {
        // Add the new cell to the highlighted list
        // TODO: Don't highlight already visited if visited. Below doesn't work, not debugged
        highlightedCells.forEach(cell => {
          if (cell.row === row && cell.col === col) {
            return prev;
          }
        });

        // Go this way once I use Coordinate and have the equals function
        // if (highlightedCells.includes({row, col})) {
        //   return prev;
        // }
        highlightCell(row, col);
        return [...prev, { row, col }];
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
      const highlightedLetters = highlightedCells.map(
        (cell) => boardLetters[cell.row][cell.col]
      );
      const highlightedWord = highlightedLetters.join("");
      const isValidWord = wordValidator.check(highlightedWord);
      // Need to prevent double submits
      if (isValidWord) {
        setUserWords((prev) => {
          console.log(prev);
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
    }
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
                  onClick={() => startSearch(rowIndex, colIndex)}
                >
                  {boardLetters[rowIndex][colIndex]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        Input:{" "}
        {highlightedCells
          .map((cell) => {
            return boardLetters[cell.row][cell.col];
          })
          .join("")}
      </div>
    </>
  );
};

export default Board;
