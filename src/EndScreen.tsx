import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { MoveScorer } from "./algorithm/MoveScorer";

interface EndScreenProps {
  userWords: string[];
  solution: Set<string>;
  onRestart: () => void;
}

// Need to show all words on non-daily challenge
const EndScreen: React.FC<EndScreenProps> = ({
  userWords,
  solution,
  onRestart,
}) => {
  // Sort solution by length (longest to shortest) and then alphabetically
  const sortedSolution = [...solution].sort(
    (a, b) => b.length - a.length || a.localeCompare(b)
  );

  const moveScorer = new MoveScorer();
  let userScore = 0;
  userWords.forEach((word: string) => {
    userScore += moveScorer.scoreWord(word);
  });
  let puzzleScore = 0;
  sortedSolution.forEach((word: string) => {
    puzzleScore += moveScorer.scoreWord(word);
  });

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
      <Button variant="contained" color="primary" onClick={onRestart}>
        Play Again
      </Button>
    </div>
  );
};

export default EndScreen;
