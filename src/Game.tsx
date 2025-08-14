import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./App.css";
import { LetterShuffler } from "./algorithm/LetterShuffler";
import Board, { BoardRef } from "./Board";
import { Board as BoardModel } from "./models/Board";
import { PuzzleSolver } from "./algorithm/PuzzleSolver";
import { MoveValidator } from "./algorithm/MoveValidator";
import { WordValidator } from "./algorithm/WordValidator";
import EndScreen from "./EndScreen";
import { Coordinate } from "./models/Coordinate";
import { Word } from "./models/Word";
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
  isTempus?: boolean;
}

const Game: React.FC<GameProps> = ({ isDaily, isTempus = false }) => {
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
  const [keyboardInput, setKeyboardInput] = useState<string>("");
  const [validPaths, setValidPaths] = useState<Coordinate[][]>([]);
  const [activeTiles, setActiveTiles] = useState<Set<string>>(new Set());
  //const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  const boardRef = useRef<BoardRef>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const boardSetup = searchParams.get("board");

  useEffect(() => {
    if (boardSetup) {
      setLetters(BoardModel.mapStringToBoard(boardSetup, PUZZLE_SIZE));
    } else {
      if (isTempus) {
        const tempusBoard = [
          ["T", "E", "U", "R", "O"],
          ["M", "N", "S", "A", "L"],
          ["H", "T", "S", "T", "O"],
          ["L", "A", "I", "G", "T"],
          ["H", "E", "Y", "N", "I"],
        ];
        setLetters(tempusBoard);
      } else if (isDaily) {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const playedDate = localStorage.getItem("dailyGamePlayed");
        const userWordsDaily = localStorage.getItem("userWordsDaily");

        if (playedDate === today && userWordsDaily) {
          const tempWords: string[] = JSON.parse(userWordsDaily);
          setUserWords(tempWords);
          setGameOver(true);
        }
        setLetters(letterShuffler.dailyShuffle());
      } else {
        setLetters(letterShuffler.shuffle());
      }
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
    if (!isDaily) {
      setSearchParams({ board: tempBoard.printBoard() });
    }
  }, [letters, dictionary]);

  const resetBoard = useCallback(() => {
    setLetters(letterShuffler.shuffle());
    setTimeLeft(181);
    setUserWords([]);
    setKeyboardInput("");
    setValidPaths([]);
    setActiveTiles(new Set());
  }, [letterShuffler]);

  // Find all valid paths that can be formed with the current keyboard input
  const findValidPaths = useCallback(
    (input: string): Coordinate[][] => {
      if (!board || !moveValidator || input.length === 0) {
        return [];
      }

      const paths: Coordinate[][] = [];
      const letters = input.toUpperCase();

      // Start with all positions of the first letter
      const firstLetterPositions = board.getTileLocations(letters[0]);

      // For each starting position, try to build paths
      for (const startPos of firstLetterPositions) {
        const word = new Word();
        word.appendCharacter(new Coordinate(startPos.xCoord, startPos.yCoord));

        const completePaths = buildPathsRecursively(
          word,
          letters,
          1,
          moveValidator,
          board
        );
        paths.push(...completePaths);
      }

      return paths;
    },
    [board, moveValidator]
  );

  // Recursive function to build valid paths
  const buildPathsRecursively = (
    currentWord: Word,
    targetLetters: string,
    index: number,
    validator: MoveValidator,
    boardModel: BoardModel
  ): Coordinate[][] => {
    // If we've matched all letters, return the current path
    if (index >= targetLetters.length) {
      return [
        currentWord.path.map(
          (coord) => new Coordinate(coord.xCoord, coord.yCoord)
        ),
      ];
    }

    const paths: Coordinate[][] = [];
    const nextLetter = targetLetters[index];

    // Get all valid next moves for this letter
    const validMoves = validator.getValidMoves(nextLetter, currentWord);

    for (const move of validMoves) {
      const newWord = new Word(currentWord);
      newWord.appendCharacter(new Coordinate(move.xCoord, move.yCoord));

      // Recursively build paths from this position
      const subPaths = buildPathsRecursively(
        newWord,
        targetLetters,
        index + 1,
        validator,
        boardModel
      );
      paths.push(...subPaths);
    }

    return paths;
  };

  const handleRestart = () => {
    setGameOver(false);
    navigate("/game");
    resetBoard();
  };

  // Handle keyboard input for typing letters
  const handleKeyboardInput = useCallback(
    (event: KeyboardEvent) => {
      // Ignore input if game is over or modals are open
      if (gameOver || instructionsModalOpen || startModalOpen) {
        return;
      }

      const key = event.key.toUpperCase();

      // First, try to let Board component handle Enter/Space for mouse/touch interactions
      if (event.key === "Enter" || event.key === " ") {
        const boardHandled = boardRef.current?.handleKeyboardSubmit(event.key);
        if (boardHandled) {
          return; // Board component handled it, we're done
        }

        // Board didn't handle it, so handle keyboard input
        if (event.key === " ") {
          event.preventDefault(); // Prevent page scrolling
        }

        if (keyboardInput.length >= 4 && validPaths.length > 0) {
          // Submit the first valid path found
          const firstPath = validPaths[0];
          const word = firstPath.map((coord) => board!.getTile(coord)).join("");

          if (wordValidator?.check(word)) {
            setUserWords((prev) => {
              if (!prev.includes(word)) {
                return [word, ...prev];
              }
              return prev;
            });
          }
        }

        // Handle Enter vs Space differently
        if (event.key === "Enter") {
          // Clear keyboard input after Enter
          setKeyboardInput("");
          setValidPaths([]);
          setActiveTiles(new Set());
        }
        // Space keeps the keyboard input active for similar words

        return;
      }

      // Handle Backspace
      if (event.key === "Backspace") {
        const newInput = keyboardInput.slice(0, -1);
        setKeyboardInput(newInput);

        const newPaths = findValidPaths(newInput);
        setValidPaths(newPaths);

        // Update active tiles
        const newActiveTiles = new Set<string>();
        newPaths.forEach((path) => {
          path.forEach((coord) => {
            newActiveTiles.add(`${coord.xCoord}-${coord.yCoord}`);
          });
        });
        setActiveTiles(newActiveTiles);
        return;
      }

      // Handle letter input (A-Z)
      if (key.match(/^[A-Z]$/) && keyboardInput.length < 25) {
        // Reasonable max length
        const newInput = keyboardInput + key;

        // Check if this new input would create any valid paths
        const newPaths = findValidPaths(newInput);

        // Only update the input if there are valid paths for the new input
        if (newPaths.length > 0) {
          setKeyboardInput(newInput);
          setValidPaths(newPaths);

          // Update active tiles based on valid paths
          const newActiveTiles = new Set<string>();
          newPaths.forEach((path) => {
            path.forEach((coord) => {
              newActiveTiles.add(`${coord.xCoord}-${coord.yCoord}`);
            });
          });
          setActiveTiles(newActiveTiles);
        }
        // If no valid paths exist for the new input, ignore the keystroke
      }
    },
    [
      keyboardInput,
      validPaths,
      gameOver,
      instructionsModalOpen,
      startModalOpen,
      board,
      wordValidator,
      findValidPaths,
    ]
  );

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardInput);
    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [handleKeyboardInput]);

  if (gameOver && solution) {
    return (
      <EndScreen
        userWords={userWords}
        solution={solution}
        onRestart={handleRestart}
        isDaily={isDaily}
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
              the screen. <br />
              Alternatively, you can type letters on your keyboard - valid paths
              will be highlighted, and press Enter to submit.
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
              the letters active. <br />
              Alternatively, you can type letters on your keyboard - valid paths
              will be highlighted, and press Enter to submit.
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
        <DialogTitle id="start-dialog-title">
          {isTempus ? "Goodbye for now!" : "New game"}
        </DialogTitle>
        <DialogContent>
          <p>
            {isTempus ? (
              <>
                This is a Tempus specific version of Boggle, so expect some
                neuro words to be sprinkled in. No proper nouns though. <br />
                Words must be 4 letters or longer. You have 3 minutes! <br />
                There are {solution?.size} words to find
              </>
            ) : (
              <>
                Click "Play Now" to begin playing! <br /> Words must be 4
                letters or longer. You have 3 minutes! <br /> There are{" "}
                {solution?.size} words to find
              </>
            )}
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
                ref={boardRef}
                board={board}
                wordValidator={wordValidator}
                setUserWords={setUserWords}
                moveValidator={moveValidator}
                activeTiles={activeTiles}
              />
              <Box
                sx={{ display: "flex", gap: "10px", justifyContent: "center" }}
              >
                {!isDaily ? (
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={resetBoard}
                  >
                    New Board
                  </Button>
                ) : (
                  <></>
                )}
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
              {keyboardInput && (
                <Typography
                  className="subtitle"
                  sx={{ mt: 1, fontWeight: "bold" }}
                >
                  {keyboardInput}
                </Typography>
              )}
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
