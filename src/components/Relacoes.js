/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react'
import Select from 'react-select' // https://react-select.com/home
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'


let state = { selectedOption: null }
let onlyAmongSelected = true
let onlySentiment = true
const minYear = 1994
const maxYear = 2024

function Queries() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [selectedOption, setSelectedOption] = useState()
  const [Yearsvalues, setValue] = useState([2000, 2024])
  const [personalities, setPersonalities] = useState()

  // read the persons.json to fill the select
  function loadPersonalities() {
    setLoading(true)
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/persons/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPersonalities(data)
        setLoading(false)
        console.log('loaded')
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    loadPersonalities()
  }, [])

  const handleClick = async () => {
    // get selected persons
    const result = state.map((a) => a.value)
    let params = ''
    for (let i = 0; i < result.length; i += 1) {
      params += `&q=${result[i]}`
    }

    // get years range
    const [min, max] = Yearsvalues

    params += `&selected=${onlyAmongSelected}`
    params += `&sentiment=${onlySentiment}`
    params += `&start=${min}`
    params += `&end=${max}`

    setLoading(true)

    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/timeline/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data.news)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
    setSelectedOption(state)
  }

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e)
    state = e
  }

  // eslint-disable-next-line no-unused-vars
  const handleChangeRelationships = (e) => {
    onlySentiment = e.target.checked
  }

  // eslint-disable-next-line no-unused-vars
  const handleChangePersons = (e) => {
    onlyAmongSelected = e.target.checked
  }

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues)
  }

  return (
    <React.Fragment>
      <Typography component="div" sx={{ paddingTop: 15 }}>
        <Box sx={{ textAlign: 'center', m: 1 }}>
        Escolha as personalidades e um intervalo de tempo para ver as notícias ontem interagem
      </Box>
    </Typography>
      {loading ? (
        <CircularIndeterminate />
      ) : (
        <React.Fragment>
          
          {/* select personalities */}
          <Grid container sx={{ paddingTop: 2 }}>
            <Grid item xs={4} />
            <Grid item xs={4} sx={{ paddingTop: 2 }}>
              <Select class="centered" isMulti value={selectedOption} onChange={handleChange} options={personalities} />
            </Grid>
            <Grid item xs={4} />
          </Grid>

          {/* dates interval */}
          <Grid container sx={{ paddingTop: 1 }}>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <center>
                <Box sx={{ width: 400 }}>
                  <Slider
                    getAriaLabel={() => 'Intervalo Datas'}
                    value={Yearsvalues}
                    onChange={handleChangeYears}
                    valueLabelDisplay="auto"
                    min={minYear}
                    max={maxYear}
                  />
                </Box>
              </center>
            </Grid>
          </Grid>

          {/* switch buttons */}
          <Grid container alignItems="center" spacing={1} sx={{ width: '80%', margin: 'auto', paddingTop: -1 }}>
            <Grid item xs={2} />
            <Grid item xs={4} container direction="column" alignItems="center">
              <Grid item>
                <Switch defaultChecked={onlyAmongSelected} onChange={handleChangePersons} />
              </Grid>
              <Grid item>
                <Typography variant="body1">Apenas entre os seleccionados</Typography>
              </Grid>
            </Grid>
            <Grid item xs={4} container direction="column" alignItems="center">
              <Grid item>
                <Switch defaultChecked={onlySentiment} onChange={handleChangeRelationships} />
              </Grid>
              <Grid item>
                <Typography variant="body1">Apenas notícias apoio/oposição</Typography>
              </Grid>
            </Grid>
            <Grid item xs={2} />
          </Grid>

          {/* update button */}
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={4} sx={{ paddingBottom: 2, paddingTop: 2 }}>
              <center>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleClick()
                  }}
                >
                  Actualizar
                </Button>
              </center>
            </Grid>
            <Grid item xs={4} />
          </Grid>

          {/* news titles */}
          <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
            sx={{ paddingTop: 10 }}
          >
            {!response ? <p /> : <NewsTitles data={response} />}
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Queries
