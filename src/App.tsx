import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { LetterShuffler } from "./algorithm/LetterShuffler";
import Board from "./Board";
import { Board as BoardModel } from "./models/Board";
import { PuzzleSolver } from "./algorithm/PuzzleSolver";
import { MoveValidator } from "./algorithm/MoveValidator";
import { WordValidator } from "./algorithm/WordValidator";

function App() {
  const letterShuffler = new LetterShuffler(5);
  const [letters, setLetters] = useState<string[][]>(letterShuffler.shuffle());
  const [words, setWords] = useState(0);
  const [wordValidator, setWordValidator] = useState<WordValidator | null>(null);

  const board = new BoardModel(letters);
  const moveValidator = new MoveValidator(board);
  let puzzleSolver;

  useEffect(() => {
    const loadTextFile = async () => {
      try {
        // This loads in the words to the application
        const response = await fetch("./Dictionary");
        //const response = await fetch('./words.txt'); // Middle ground dictionary for speed
        //const response = await fetch('./test_words.txt'); // Use for testing
        const text = await response.text();
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        const tempWordValidator = new WordValidator(lines);
        puzzleSolver = new PuzzleSolver(moveValidator, tempWordValidator);
        setWordValidator(tempWordValidator);
        puzzleSolver.searchBoard(board);
        puzzleSolver.getWords().forEach((wordString: string) => {
          console.log(wordString);
        });
        setWords(puzzleSolver.getWords().size);
      } catch (error) {
        console.error("Error loading the text file:", error);
      } finally {
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
      <h1>Lexile</h1>
      {wordValidator && (
        <div className="card">
          <Board board={board} wordValidator={wordValidator} />
          <button onClick={shuffleBoard}>Shuffle board</button>
          <h3>Total Words: {words} </h3>
        </div>
      )}
    </>
  );
}

export default App;
