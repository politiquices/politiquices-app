import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from "@material-ui/core";

const customTheme = createTheme({
  palette: {
    primary: {
      light: "#8885c7",
      main: "#FFD0A3",
      dark: "#302c82"
    },
    background: {
      default: "#FFFFFF"
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);