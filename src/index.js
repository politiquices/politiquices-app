import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from "@material-ui/core";

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
    primary: {
      light: "#8885c7",
      main: "#000",
      dark: "#302c82"
    },
    background: {
      default: "#000000"
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