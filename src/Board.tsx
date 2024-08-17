import React from 'react';

interface BoardProps {
  board: string[][];
}

const Board: React.FC<BoardProps> = ({ board }) => {
  if (board.length !== 5 || board.some(row => row.length !== 5)) {
    throw new Error('Board must be a 5x5 matrix.');
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px' }}>
      {board.flat().map((cell, index) => (
        <div
          key={index}
          style={{
            border: '1px solid black',
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
          }}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};

export default Board;
