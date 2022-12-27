import React, { useState, useEffect } from 'react'
import Select from 'react-select' // https://react-select.com/home
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import NewsTitles from './utils/NewsTitles'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import CircularIndeterminate from './utils/Circular'

let state = { selectedOption: null }
let onlyAmongSelected = true
let onlySentiment = true
let min = 2014
let max = 2022

const Relacoes = () => {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [selectedOption, setSelectedOption] = useState()
  const [value, setValue] = useState([2000, 2014])
  const [personalities, setPersonalities] = useState()

  // read the persons.json to fill the select
  function loadPersonalities () {
    setLoading(true)
    fetch('http://127.0.0.1:8000/persons/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setPersonalities(data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  useEffect(() => {
    loadPersonalities()
  }, [])

  const handleClick = async () => {
    if (selectedOption == null) {
      console.log('empty')
    } else {
      const result = state.map(a => a.value)

      let params = ''
      for (let i = 0; i < result.length; i++) {
        params += '&q=' + result[i]
      }

      params += '&selected=' + onlyAmongSelected
      params += '&sentiment=' + onlySentiment
      params += '&start=' + min
      params += '&end=' + max

      setLoading(true)

      fetch(`http://127.0.0.1:8000/timeline/?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          setResponse(data)
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
          console.log(err)
        })
      setSelectedOption(state)
    }
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

  const handleChangeYears = (event, newValue) => {
    setValue(newValue)
    min = newValue[0]
    max = newValue[1]
  }

  const Politicians = () => (
    <Select
      class="centered"
      isMulti={true}
      value={selectedOption}
      onChange={handleChange}
      options={personalities}
      />
  )

  return (
    <React.Fragment>
      {loading
        ? (<CircularIndeterminate/>)
        : (
          <React.Fragment>
          { /* select personality */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} sx={{ paddingTop: 2 }}><Politicians/></Grid>
            <Grid item xs={4}></Grid>
          </Grid>

          { /* dates interval */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <center>
              <Box sx={{ width: 300 }}>
                <Slider
                  getAriaLabel={() => 'Intervalo Datas'}
                  value={value}
                  onChange={handleChangeYears}
                  valueLabelDisplay="auto"
                  min={1994}
                  max={2022}
                />
              </Box>
              </center>
            </Grid>
          </Grid>

          { /* switch buttons */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}><Switch defaultChecked={onlyAmongSelected} onChange={handleChangePersons}/>Apenas entre seleccionados</Grid>
            <Grid item xs={2}><Switch defaultChecked={onlySentiment} onChange={handleChangeRelationships}/>Apenas apoio/oposição</Grid>
            <Grid item xs={4}></Grid>
          </Grid>

          { /* updated button */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} sx={{ paddingBottom: 2 }}>
              <center>
                <Button variant="contained" onClick={() => { handleClick() }}>Actualizar</Button>
              </center>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>

        { /* news titles */}
        <Grid container direction="row" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="space-evenly">

        {(!response)
          ? (<p></p>)
          : <NewsTitles data={response}/>
        }

        </Grid>
        </React.Fragment>
          )
    }
    </React.Fragment>
  )
}

export default Relacoes
