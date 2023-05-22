/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { TextField, Typography } from '@mui/material'
import CircularIndeterminate from './utils/Circular'
import Answers from './utils/Answers'

function Pesquisa() {
  const [loading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [question, setQuestion] = useState('')

  const handleClick = async () => {
    setIsLoading(true)
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/qa/${question}`)
      .then((response) => response.json())
      .then((answers) => {
        setIsLoading(false)
        setData(answers)
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
  }

  function handleTextFieldChange(event) {
    setQuestion(event.target.value)
  }

  return (
    <React.Fragment>
      {loading ? (
        <CircularIndeterminate />
      ) : (
        <React.Fragment>
          <Grid justifyContent="center" container sx={{ paddingTop: 20 }}>
            <Grid item xs={12} />
            <Typography align="center" sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
              Indique uma pergunta a fazer à colecção de documentos
            </Typography>
          </Grid>

          <Grid justifyContent="center" container sx={{ paddingTop: 10 }} alignItems="center">
            <Grid item xs={12}>
              <center>
                <TextField
                  sx={{
                    width: { sm: 800, md: 1200 },
                    '& .MuiInputBase-root': {
                      height: 50,
                    },
                    '& fieldset': {
                      borderRadius: '25px',
                    },
                  }}
                  id="filled-basic"
                  label=""
                  variant="filled"
                  onChange={(e) => handleTextFieldChange(e)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault()
                      handleClick(ev)
                    }
                  }}
                />
              </center>
            </Grid>
          </Grid>

          {/* news titles */}
          <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
            sx={{ paddingTop: 2 }}
          >
            {!data ? <p /> : <Answers data={data} />}
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Pesquisa
