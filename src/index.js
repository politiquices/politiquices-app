import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
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
    text: {
      primary: "#ffffff"
    },
    background: {
      default: "#222222"
    }
  },
})


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
