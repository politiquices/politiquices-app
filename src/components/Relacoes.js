/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react'
import Select from 'react-select' // https://react-select.com/home
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'

let state = { selectedOption: null }
let onlyAmongSelected = true
let onlySentiment = true
const minYear = 1994
const maxYear = 2022

function Relacoes() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [selectedOption, setSelectedOption] = useState()
  const [Yearsvalues, setValue] = useState([2000, 2014])
  const [personalities, setPersonalities] = useState()

  // read the persons.json to fill the select
  function loadPersonalities() {
    setLoading(true)
    fetch('http://127.0.0.1:8000/persons/', {
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

    fetch(`http://127.0.0.1:8000/timeline/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data)
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

  const handleChangeRelationships = (e) => {
    onlySentiment = e.target.checked
    console.log(onlySentiment)
  }

  const handleChangePersons = (e) => {
    onlyAmongSelected = e.target.checked
    console.log(onlyAmongSelected)
  }

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues)
  }

  return (
    <React.Fragment>
      {loading ? (
        <CircularIndeterminate />
      ) : (
        <React.Fragment>
          {/* select personality */}
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={4} sx={{ paddingTop: 2 }}>
              <Select
                class="centered"
                isMulti
                value={selectedOption}
                onChange={handleChange}
                options={personalities}
              />
            </Grid>
            <Grid item xs={4} />
          </Grid>

          {/* dates interval */}
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <center>
                <Box sx={{ width: 300 }}>
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
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={2}>
              <Switch
                defaultChecked={onlyAmongSelected}
                onChange={handleChangePersons}
              />
              Apenas entre seleccionados
            </Grid>
            <Grid item xs={2}>
              <Switch
                defaultChecked={onlySentiment}
                onChange={handleChangeRelationships}
              />
              Apenas apoio/oposição
            </Grid>
            <Grid item xs={4} />
          </Grid>

          {/* update button */}
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={4} sx={{ paddingBottom: 2 }}>
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
            direction="row"
            spacing={2}
            columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-evenly"
          >
            {!response ? <p /> : <NewsTitles data={response} />}
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Relacoes
