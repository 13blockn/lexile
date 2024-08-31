import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { MoveScorer } from "./algorithm/MoveScorer";

interface EndScreenProps {
  userWords: string[];
  solution: Set<string>;
  onRestart: () => void;
  isDaily: boolean;
}

const EndScreen: React.FC<EndScreenProps> = ({
  userWords,
  solution,
  onRestart,
  isDaily,
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const sortedSolution = [...solution].sort(
    (a, b) => b.length - a.length || a.localeCompare(b)
  );

  const moveScorer = new MoveScorer();
  let userScore = 0;
  userWords.forEach((word: string) => {
    userScore += moveScorer.scoreWord(word);
  });

  // I only should store words from the daily game
  useEffect(() => {
    if (isDaily) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("dailyGamePlayed", today);
      localStorage.setItem("userWordsDaily", JSON.stringify(userWords));
      localStorage.setItem("userScoreDaily", userScore.toString());
    }
  }, [userScore, userWords]);

  let puzzleScore = 0;
  const puzzleScorer = new MoveScorer();
  sortedSolution.forEach((word: string) => {
    puzzleScore += puzzleScorer.scoreWord(word);
  });

  const baseUrl = `${window.location.origin}${location.pathname}${location.search}`;
  const shareText = `I found ${userWords.length} words and scored ${userScore} points out of ${puzzleScore} in Lexile! Can you beat my score? ${baseUrl}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        console.log("Text copied to clipboard!");
      })
      .catch((error) => console.error("Failed to copy text:", error));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        gap: "12px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">Time's Up!</Typography>
      <Typography variant="h5">
        RANK: {moveScorer.getRank(puzzleScore)} <br />
        You found {userWords.length} out of {solution.size} words. <br />
        You scored {userScore} points out of {puzzleScore}
      </Typography>
      <div>
        <Typography variant="h6">All Words:</Typography>
        <List
          style={{
            maxHeight: "400px",
            overflow: "auto",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {sortedSolution.map((word, index) => (
            <ListItem key={index} style={{ justifyContent: "space-between" }}>
              <ListItemText primary={word} />
              {userWords.includes(word) && (
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
              )}
            </ListItem>
          ))}
        </List>
      </div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Share Your Score
      </Button>
      <Button variant="outlined" color="secondary" onClick={onRestart}>
        Play Again
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share Your Score</DialogTitle>
        <DialogContent>
          <DialogContentText>{shareText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyToClipboard} color="primary">
            Copy to Clipboard
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EndScreen;
