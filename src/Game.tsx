import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import { LetterShuffler } from "./algorithm/LetterShuffler";
import Board from "./Board";
import { Board as BoardModel } from "./models/Board";
import { PuzzleSolver } from "./algorithm/PuzzleSolver";
import { MoveValidator } from "./algorithm/MoveValidator";
import { WordValidator } from "./algorithm/WordValidator";
import EndScreen from "./EndScreen";
import { Box, Button, Typography, Popover } from "@mui/material";

const PUZZLE_SIZE = 5;

function App() {
  const letterShuffler = new LetterShuffler(PUZZLE_SIZE);
  const [letters, setLetters] = useState<string[][]>(letterShuffler.shuffle());
  const [wordValidator, setWordValidator] = useState<WordValidator | null>(
    null
  );
  const [userWords, setUserWords] = useState<string[]>([]);
  const [solution, setSolution] = useState<Set<string>>();
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState<BoardModel | null>();
  const [moveValidator, setMoveValidator] = useState<MoveValidator>();
  const [dictionary, setDictionary] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const boardSetup = searchParams.get("board");

  useEffect(() => {
    if (boardSetup) {
      setLetters(BoardModel.mapStringToBoard(boardSetup, PUZZLE_SIZE));
    } else {
      setLetters(letterShuffler.shuffle());
    }
  }, []);

  useEffect(() => {
    if (modalOpen) {
      return; // Do nothing if the modal is open, effectively pausing the timer
    }
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft, modalOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

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
        setDictionary(lines);
      } catch (error) {
        console.error("Error loading the text file:", error);
      }
    };

    loadTextFile();
  }, []);

  useEffect(() => {
    if (board) {
      setMoveValidator(new MoveValidator(board)); // This looks right
    }
  }, [board]);

  useEffect(() => {
    if (moveValidator) {
      const tempWordValidator = new WordValidator(dictionary);
      puzzleSolver = new PuzzleSolver(moveValidator, tempWordValidator);
      setWordValidator(tempWordValidator);
      puzzleSolver.searchBoard(board!);
      setSolution(puzzleSolver.getWords());
    }
  }, [moveValidator]);

  useEffect(() => {
    if (dictionary.length === 0) {
      return;
    }

    const tempBoard = new BoardModel(letters);
    setBoard(tempBoard);
    setSearchParams({ board: tempBoard.printBoard() });
  }, [letters, dictionary]);

  // Shuffle the board and update the state
  const shuffleBoard = useCallback(() => {
    setLetters(letterShuffler.shuffle());
    setTimeLeft(180);
    setUserWords([]);
  }, [letterShuffler]);

  const handleRestart = () => {
    setGameOver(false);
    shuffleBoard();
  };

  if (gameOver) {
    return (
      <EndScreen
        userWords={userWords}
        solution={solution!}
        onRestart={handleRestart}
      />
    );
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
          This game is similar to Boggle, where you have a board filled with
          letters. <br />
          You can connect letters in any direction, but you cannot use the same
          letter twice. <br />
          To start your word, left click on a letter. From there, you can drag
          your mouse. <br />
          When you're ready to submit your word, press enter or tap on the tile!
        </Typography>
      </Popover>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />
        {wordValidator && board && moveValidator && (
          <Box
            className="card"
            sx={{
              flex: { xs: 1, sm: 3 },
            }}
          >
            <Board
              board={board}
              wordValidator={wordValidator}
              setUserWords={setUserWords}
              moveValidator={moveValidator}
            />
            <Box
              sx={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button variant="contained" sx={{ mt: 1 }} onClick={shuffleBoard}>
                Shuffle board
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => setGameOver(true)}
              >
                Retire early
              </Button>
            </Box>
            <Typography className="subtitle">
              Total Words: {solution?.size}
            </Typography>
            <Typography className="subtitle">
              Found Words: {userWords.length}
            </Typography>
            <Typography className="subtitle">
              Time Left: {formatTime(timeLeft)}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            maxHeight: "600px",
            overflowY: "scroll",
            flex: 1,
            display: { xs: "none", sm: "block" },
          }}
        >
          <Typography variant="h5">Your Words</Typography>
          {userWords.map((word, index) => (
            <Typography key={index} sx={{ mt: 1 }}>
              {word}
            </Typography>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default App;
