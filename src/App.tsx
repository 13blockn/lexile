import { useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LetterShuffler } from './algorithm/LetterShuffler'
import Board from './Board'
import { Board as BoardModel } from './models/Board';
import { PuzzleSolver } from './algorithm/PuzzleSolver'
import { MoveValidator } from './algorithm/MoveValidator'

function App() {
  const letterShuffler = new LetterShuffler(5);
  const [letters, setLetters] = useState<string[][]>(letterShuffler.shuffle());

  const board = new BoardModel(letters);
  const moveValidator = new MoveValidator(board);
  let puzzleSolver;

  useEffect(() => {
    const loadTextFile = async () => {
      console.log('Use effect triggered');
      try {
        // This loads in the words to the application
        const response = await fetch('./Dictionary');
        //const response = await fetch('./words.txt'); // Middle ground dictionary for speed
        //const response = await fetch('./test_words.txt'); // Use for testing
        const text = await response.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        puzzleSolver = new PuzzleSolver(moveValidator, lines);
        puzzleSolver.searchBoard(board);
        puzzleSolver.getWords().forEach((wordString: string) => {
          console.log(wordString);
        });
      } catch (error) {
        console.error('Error loading the text file:', error);
      }
    };

    loadTextFile();
  }, []);

  // Shuffle the board and update the state
  const shuffleBoard = useCallback(() => {
    setLetters(letterShuffler.shuffle());
  }, [letterShuffler]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Board board={letters} />
        <button onClick={shuffleBoard}>
          Shuffle board
        </button>
      </div>
    </>
  );
}

export default App;