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
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Popover,
  useMediaQuery,
} from "@mui/material";

const PUZZLE_SIZE = 5;

interface GameProps {
  isDaily: boolean;
}

const Game: React.FC<GameProps> = ({ isDaily }) => {
  const letterShuffler = new LetterShuffler(PUZZLE_SIZE);
  const [letters, setLetters] = useState<string[][]>(letterShuffler.shuffle());
  const [wordValidator, setWordValidator] = useState<WordValidator | null>(
    null
  );
  const [userWords, setUserWords] = useState<string[]>([]);
  const [solution, setSolution] = useState<Set<string>>();
  const [instructionsModalOpen, setModalOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(181);
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
      console.log(`Might be daily game: ${isDaily}`);
      setLetters(letterShuffler.dailyShuffle());
    }
  }, []);

  useEffect(() => {
    if (instructionsModalOpen || startModalOpen) {
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
  }, [timeLeft, instructionsModalOpen, startModalOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

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
      setStartModalOpen(true);
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

  const resetBoard = useCallback(() => {
    setLetters(letterShuffler.shuffle());
    setTimeLeft(181);
    setUserWords([]);
  }, [letterShuffler]);

  const handleRestart = () => {
    setGameOver(false);
    resetBoard();
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
        backgroundColor: instructionsModalOpen
          ? "rgba(0,0,0,0.3)"
          : "transparent",
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
        open={instructionsModalOpen}
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
          {isSmallScreen ? (
            <>
              This game is similar to Boggle, where you have a board filled with
              letters. <br />
              You can connect letters in any direction (including diagonals),
              but you cannot use the same letter twice. Your words must be 4
              letters or longer <br />
              To start your word, touch a letter. From there, start dragging
              your finger along the screen. <br />
              When you're ready to submit your word, release your finger from
              the screen.
            </>
          ) : (
            <>
              This game is similar to Boggle, where you have a board filled with
              letters. <br />
              You can connect letters in any direction (including diagonals),
              but you cannot use the same letter twice. Your words must be 4
              letters or longer <br />
              To start your word, left click on a letter. From there, you can
              drag your mouse. <br />
              When you're ready to submit your word, press enter or tap on the
              tile! Press space if you want to submit your word, but keep all of
              the letters active.
            </>
          )}
        </Typography>
      </Popover>
      <Dialog
        open={startModalOpen}
        onClose={() => setStartModalOpen(false)}
        disableEscapeKeyDown
        aria-labelledby="start-dialog-title"
      >
        <DialogTitle id="start-dialog-title">New game</DialogTitle>
        <DialogContent>
          <p>
            Click "Play Now" to begin playing! <br /> Words must be 4 letters or
            longer. You have 3 minutes! <br /> There are {solution?.size} words
            to find
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setStartModalOpen(false)}
            color="primary"
            variant="contained"
          >
            Play Now
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />
        {wordValidator &&
          board &&
          moveValidator &&
          (startModalOpen ? (
            <></>
          ) : (
            <Box
              sx={{
                flex: { xs: 1, sm: 3 },
                padding: "2em 0em",
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
                <Button variant="contained" sx={{ mt: 1 }} onClick={resetBoard}>
                  New Board
                </Button>
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => setGameOver(true)}
                >
                  Retire Early
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
          ))}
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
};

export default Game;
