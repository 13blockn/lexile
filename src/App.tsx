import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import Portfolio from "./components/Portfolio";
import LexileGame from "./components/LexileGame";
import Game from "./Game";
import { Analytics } from "@vercel/analytics/react"

const App: React.FC = () => {
  const [darkMode] = useState(false); // Default to light mode for portfolio

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#21CBF3',
      },
      ...(darkMode
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }
        : {
            background: {
              default: "#ffffff",
              paper: "#f5f5f5",
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh' }}>
          <Routes>
            {/* Portfolio landing page */}
            <Route path="/" element={<Portfolio />} />

            {/* Lexile game routes */}
            <Route path="/lexile" element={<LexileGame />} />
            <Route path="/lexile/game" element={<Game isDaily={false} />} />
            <Route path="/lexile/daily" element={<Game isDaily={true} />} />
            <Route path="/lexile/tempus" element={<Game isDaily={false} isTempus={true} />} />

            {/* Legacy routes for backward compatibility */}
            <Route path="/game" element={<Game isDaily={false} />} />
            <Route path="/daily" element={<Game isDaily={true} />} />
            <Route path="/tempus" element={<Game isDaily={false} isTempus={true} />} />
          </Routes>
        </Box>
      </Router>
      <Analytics />
    </ThemeProvider>
  );
};

export default App;
