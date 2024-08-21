import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";
import Game from "./Game";

const App: React.FC = () => {
  return (
    <Router>
      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Typography variant="h1">Welcome to Lexile!</Typography>
                <Typography sx={{ p: 2 }}>
                  Lexile is a daily word search game. <br />
                  This game is similar to Boggle, where you have a board filled
                  with letters. <br />
                  You can connect letters in any direction, but you cannot use
                  the same letter twice. <br />
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/game"
                  style={{ marginTop: "20px" }}
                >
                  Play
                </Button>
              </>
            }
          />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
