import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  Box,
  createTheme,
  ThemeProvider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Game from "./Game";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      ...(darkMode
        ? {
            background: {
              default: "#121212",
            },
          }
        : {
            background: {
              default: "#ffffff",
            },
          }),
    },
  });

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          width="100vw"
          justifyContent="center"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Container
            style={{ textAlign: "center", flexGrow: 1, marginTop: "50px" }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Typography variant="h1">Welcome to Lexile!</Typography>
                    <Typography sx={{ p: 2 }}>
                      Lexile is a daily word search game. <br />
                      This game is similar to Boggle, where you have a board
                      filled with letters. <br />
                      You can connect letters in any direction, but you cannot
                      use the same letter twice. <br />
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
              <Route path="/game" element={<Game isDaily={false} />} />
              <Route path="/daily" element={<Game isDaily={true} />} />
            </Routes>
          </Container>
          <Box
            display="flex"
            justifyContent="flex-end"
            padding="10px"
            style={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          >
            <FormControlLabel
              control={
                <Switch checked={darkMode} onChange={handleThemeToggle} />
              }
              label={darkMode ? "Dark Mode (WIP)" : "Light Mode (WIP)"}
              style={{ marginLeft: "auto" }}
            />
          </Box>
          <Box
            component="footer"
            style={{
              textAlign: "center",
              padding: "10px",
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="body2">
              Lexile was built by Nate Block with Executive Producing credits to
              Nicholas Day
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
