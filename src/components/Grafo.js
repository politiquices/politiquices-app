/* eslint-disable react/self-closing-comp */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select' // https://react-select.com/home
import { Network } from 'vis-network'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import NewsTitles from './utils/NewsTitles'

let state = { selectedOption: null }
let onlyAmongSelected = true
let onlySentiment = true
const minYear = 1994
const maxYear = 2024


function VisNetwork() {
  const container = useRef(null)
  const options = {}

  const initNodes = [
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
  ]

  const initEdges = [
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
  ]

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
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
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    console.log("calling useEffect 1")
    loadPersonalities()
  }, [])

  // handle 'Actualizar' button click
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

    console.log(params)

    setLoading(true)

    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/timeline/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data.news)
        setNodes(data.nodes)
        setEdges(data.edges)
        setLoading(false)
        console.log("nodes: ", nodes)
        console.log("edges: ", edges)
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

  useEffect(() => {
    console.log("calling useEffect 2")
  	// Use `network` here to configure events, etc.
    const network = container.current && new Network(container.current, { nodes, edges }, options)
  }, [container, nodes, edges])
  
  return (
    <>
    <Box alignItems="center">
      <div
        ref={container}
        style={{
          'margin-top': '100px',
          height: '650px',
          width: '1250px',
          border: '1px solid rgb(0, 0, 0)',
        }}
      ></div>
    </Box>
    
    {/* select personality */}
    <Grid container sx={{ paddingTop: 10 }}>
      <Grid item xs={4} />
      <Grid item xs={4} sx={{ paddingTop: 2 }}>
        <Select class="centered" isMulti value={selectedOption} onChange={handleChange} options={personalities} />
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
        <Switch defaultChecked={onlyAmongSelected} onChange={handleChangePersons} />
        Apenas entre seleccionados
      </Grid>
      <Grid item xs={2}>
        <Switch defaultChecked={onlySentiment} onChange={handleChangeRelationships} />
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
      spacing={1}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
      sx={{ paddingTop: 10 }}
    >      
      {!response ? <p /> : <NewsTitles data={response} />}
    </Grid>
  </>
  )
    }

export default VisNetwork
