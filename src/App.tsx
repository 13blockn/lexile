import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { LetterShuffler } from "./algorithm/LetterShuffler";
import Board from "./Board";
import { Board as BoardModel } from "./models/Board";
import { PuzzleSolver } from "./algorithm/PuzzleSolver";
import { MoveValidator } from "./algorithm/MoveValidator";
import { WordValidator } from "./algorithm/WordValidator";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import EndScreen from "./EndScreen";

function App() {
  const letterShuffler = new LetterShuffler(5);
  const [letters, setLetters] = useState<string[][]>(letterShuffler.shuffle());
  const [words, setWords] = useState(0);
  const [wordValidator, setWordValidator] = useState<WordValidator | null>(
    null
  );
  const [userWords, setUserWords] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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
      }
    };

    loadTextFile();
  }, []);

  // Shuffle the board and update the state
  const shuffleBoard = useCallback(() => {
    setLetters(letterShuffler.shuffle());
    //setUserWords([]); // For some reason, using setUserWords causes everything to break.
  }, [letterShuffler]);

  const handleRestart = () => {
    setTimeLeft(180);
    setGameOver(false);
    shuffleBoard();
    //setUserWords([]);
  };

  if (gameOver) {
    return <EndScreen userWords={userWords} totalWords={words} onRestart={handleRestart} />;
  }

  return (
    <div
      style={{
        backgroundColor: modalOpen ? "rgba(0,0,0,0.3)" : "transparent",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="title">Lexile</div>
      <Button
        aria-describedby={"rules-button"}
        variant="contained"
        onClick={() => setModalOpen(true)}
      >
        Learn how to play!
      </Button>
      <Popover
        id={"rules-modal"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Typography sx={{ p: 2 }}>
          Welcome to Lexile, the daily word search game. <br />
          This game is similar to Boggle, where you have a board filled with
          letters. <br />
          You can connect letters in any direction, but you cannot use the same
          letter twice. <br />
          To start your word, left click on a letter. From there, you can drag your mouse. <br />
          When you're ready to submit your word, press enter!
        </Typography>
      </Popover>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {wordValidator && (
          <div className="card">
            <Board
              board={board}
              wordValidator={wordValidator}
              setUserWords={setUserWords}
            />
            <button onClick={shuffleBoard}>Shuffle board</button>
            <div className="subtitle">Total Words: {words} </div>
            <div className="subtitle">Time Left: {formatTime(timeLeft)}</div>
          </div>
        )}
        <div>
          <h3>Your Words</h3>
          {userWords.map((word, index) => {
            return <div key={index}>{word}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
