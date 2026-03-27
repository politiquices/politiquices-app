import { useState, useEffect } from 'react'
import Select from 'react-select' // https://react-select.com/home
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'
import { MIN_YEAR as minYear, MAX_YEAR as maxYear } from '../constants'

function Queries() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [selectedOption, setSelectedOption] = useState()
  const [Yearsvalues, setValue] = useState([2000, 2024])
  const [personalities, setPersonalities] = useState()
  const [onlyAmongSelected, setOnlyAmongSelected] = useState(true)
  const [onlySentiment, setOnlySentiment] = useState(true)
  const [isError, setIsError] = useState(false)

  // read the persons.json to fill the select
  function loadPersonalities() {
    setLoading(true)
    fetch(`${import.meta.env.VITE_POLITIQUICES_API}/persons/`, {
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
        setIsError(true)
        console.log(err)
      })
  }

  useEffect(() => {
    loadPersonalities()
  }, [])

  const handleClick = async () => {
    // get selected persons
    const result = selectedOption ? selectedOption.map((a) => a.value) : []
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

    fetch(`${import.meta.env.VITE_POLITIQUICES_API}/timeline/?${params}`, {
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
        setIsError(true)
        console.log(err)
      })
  }

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e)
  }

  const handleChangeRelationships = (e) => {
    setOnlySentiment(e.target.checked)
  }

  const handleChangePersons = (e) => {
    setOnlyAmongSelected(e.target.checked)
  }

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues)
  }

  return (
    <>
      <Typography component="div" sx={{ paddingTop: 15 }}>
        <Box sx={{ textAlign: 'center', m: 1 }}>
        Escolha as personalidades e um intervalo de tempo para ver as notícias ontem interagem
      </Box>
    </Typography>
      {loading ? (
        <CircularIndeterminate />
      ) : (
        <>
          {/* select personalities */}
          <Grid container sx={{ paddingTop: 2 }}>
            <Grid item xs={4} />
            <Grid item xs={4} sx={{ paddingTop: 2 }}>
              <Select className="centered" isMulti value={selectedOption} onChange={handleChange} options={personalities} />
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
                <Switch checked={onlyAmongSelected} onChange={handleChangePersons} />
              </Grid>
              <Grid item>
                <Typography variant="body1">Apenas entre os seleccionados</Typography>
              </Grid>
            </Grid>
            <Grid item xs={4} container direction="column" alignItems="center">
              <Grid item>
                <Switch checked={onlySentiment} onChange={handleChangeRelationships} />
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
            {isError && <div>Erro ao carregar dados.</div>}
            {!response ? <p /> : <NewsTitles data={response} />}
          </Grid>
        </>
      )}
    </>
  )
}

export default Queries
