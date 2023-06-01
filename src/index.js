import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createTheme } from '@material-ui/core'
import App from './App'

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
      main: "#2222dd",
      light: "#42a5f5",
      dark: "#1565c0"
    },
    secondary: {
      main: "#1976dd",
      light: "#42a5f5",
      dark: "#1565c0"
    }    
  },
  overrides: {
    AppBar: {
      colorPrimary: {
        backgroundColor: "#662E9B",
      },
    },
  },
})


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
    <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
