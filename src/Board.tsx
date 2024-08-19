import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { WordValidator } from './algorithm/WordValidator';
import { Board as BoardModel } from './models/Board';
import './Board.css';

interface BoardProps {
  board: BoardModel;
  wordValidator: WordValidator;
  setUserWords: Dispatch<SetStateAction<string[]>>;
}

// WordValidator is undefined
const Board: React.FC<BoardProps> = ({ board, wordValidator, setUserWords }) => {
  const [highlightedCells, setHighlightedCells] = useState<{ row: number, col: number }[]>([]);

  const boardLetters = board.getLetters();
  const boardSize = boardLetters.length;

  const handlePointerEnter = (row: number, col: number, event: React.PointerEvent<HTMLDivElement>) => {
    setHighlightedCells((prev) => {
      if (prev.length < 2) {
        (event.target as HTMLDivElement).classList.add('highlight');
        return [...prev, { row, col }];
      }
      const lastCell = prev[prev.length - 2];
  
      // Check if the newly entered cell is the last one in the list (backtracking)
      if (lastCell && lastCell.row === row && lastCell.col === col) {
        // Remove the last cell (backtracking)
        const prevCell = prev[prev.length - 1];
        const cellElement = document.querySelector(`.board-cell[data-row='${prevCell.row}'][data-col='${prevCell.col}']`);
        if (cellElement) {
          cellElement.classList.remove('highlight');
        }
        return prev.slice(0, -1);
      } else {
        // Add the new cell to the highlighted list
        (event.target as HTMLDivElement).classList.add('highlight');
        return [...prev, { row, col }];
      }
    });
  };

  const handlePointerLeave = (row: number, col: number) => {
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const highlightedLetters = highlightedCells.map(cell => boardLetters[cell.row][cell.col]);
      const highlightedWord = highlightedLetters.join('');
      const isValidWord = wordValidator.check(highlightedWord);
      // Need to prevent double submits
      if (isValidWord) {
        setUserWords((prev) => {
          console.log(prev);
          if (!prev.includes(highlightedWord)) {
            return [...prev, highlightedWord]
          }
          return prev;
        });
      }

      document.querySelectorAll('.highlight').forEach((element) => {
        element.classList.remove('highlight');
      });
      setHighlightedCells([]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
                onPointerEnter={(event) => handlePointerEnter(rowIndex, colIndex, event)}
                onPointerLeave={() => handlePointerLeave(rowIndex, colIndex)}
              >
                <div className='board-text'>
                  {boardLetters[rowIndex][colIndex]}
                </div>
                </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        Input: {highlightedCells.map((cell) => {
          return boardLetters[cell.row][cell.col];
        }).join('')}
      </div>
    </>
  );
};

export default Board;
