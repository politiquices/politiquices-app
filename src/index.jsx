import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from "@mui/material/CssBaseline";
import { Container, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import './i18n'

const customTheme = createTheme({
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Helvetica Neue',
    ].join(','),
  },
  palette: {
    background: {
      default: "#e0e0e0"
    },
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0"
    },
    secondary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0"
    }    
  },
})


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Container maxWidth="lg">
    <ThemeProvider theme={customTheme}>
    <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </Container>
  </React.StrictMode>
)
