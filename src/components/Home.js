/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react'
import Select from 'react-select' // https://react-select.com/home
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography';

import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'

const minYear = 1994
const maxYear = 2022

const relations = [
  {
    label: 'apoia',
    value: 'ent1_supports_ent2',
  },
  {
    label: 'opõe-se',
    value: 'ent1_opposes_ent2',
  },
  {
    label: 'todas c/ sentimento',
    value: 'all_sentiment',
  },
  {
    label: 'todas',
    value: 'all',
  },
]

function Relacoes() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [selectedOptionLeft, setSelectedOptionLeft] = useState()
  const [selectedOptionRight, setSelectedOptionRight] = useState()
  const [selectedRelType, setSelectedRelType] = useState()
  const [Yearsvalues, setValue] = useState([2000, 2014])
  const [personalities, setPersonalities] = useState()

  // read the persons.json to fill the select
  function loadPersonalities() {
    setLoading(true)
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/persons_and_parties/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPersonalities(data)
        setLoading(false)
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
    const [min, max] = Yearsvalues
    let params = ''

    params += `&ent1=${selectedOptionLeft.value}`
    params += `&ent2=${selectedOptionRight.value}`
    params += `&rel_type=${selectedRelType.value}`
    params += `&start=${min}`
    params += `&end=${max}`

    setLoading(true)

    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/queries?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data)
        setLoading(false)
        console.log("read response")
        console.log(data)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  // handle onChange event of any of the selects
  const handleChange = (e, box) => {
    if (box === 'left') {
      setSelectedOptionLeft(e)
    }
    if (box === 'right') {
      setSelectedOptionRight(e)
    }
    if (box === 'rel_type') {
      setSelectedRelType(e)
    }
  }

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues)
  }

  return (
    <React.Fragment>
      <Typography justify="center" fontSize={0.5}>
          notícias
          </Typography>
      <Typography component="div" sx={{ paddingTop: 10 }}>
        <Box sx={{ textAlign: 'left', m: 1 }}>
        O politiquices.pt permite pesquisar relações de apoio ou oposição entre personalidades e partidos políticos 
        expressas em títulos de notícias.
        <Typography component="div">
          <Box sx={{ textAlign: 'left', s: 1 }}>
          <ul>
          <li>Que acusações fez Passos Coelho a José Sócrates?</li>
          <li>Quem do PS se opôs/apoiou a José Sócrates?</li>
          <li>Que personalidades do BE se opuseram a Jerónimo de Sousa?</li>
          <li>Que personalidades afiliadas ao BE se opuseram a personalidades do PCP?</li>
          <li>Que personalidades do PS apoiaram/se opuseram a outras personalidades do PS?</li>
          </ul>
          </Box>
        </Typography>
      </Box>
    </Typography>

      {loading ? (
        <CircularIndeterminate />
      ) : (
        <React.Fragment>
          {/* select personality */}
          <Grid container sx={{ paddingTop: 10 }}>
            <Grid item xs={1} />

            {/* Ent1 */}
            <Grid item xs={3}>
              <Select
                class="centered"
                value={selectedOptionLeft}
                onChange={(e) => handleChange(e, 'left')}
                options={personalities}
              />
            </Grid>
            <Grid item xs={1} />
            {/* RelType */}
            <Grid item xs={2}>
              <Select
                class="centered"
                value={selectedRelType}
                onChange={(e) => handleChange(e, 'rel_type')}
                options={relations}
              />
            </Grid>
            <Grid item xs={1} />
            {/* Ent2 */}
            <Grid item xs={3}>
              <Select
                class="centered"
                value={selectedOptionRight}
                onChange={(e) => handleChange(e, 'right')}
                options={personalities}
              />
            </Grid>

            <Grid item xs={1} />
          </Grid>

          {/* dates interval */}
          <Grid container sx={{ paddingTop: 5 }}>
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

          {console.log("response")}

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

export default Relacoes
