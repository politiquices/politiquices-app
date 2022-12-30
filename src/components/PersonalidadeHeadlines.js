/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import CircularIndeterminate from './utils/Circular'

function PersonalidadeHeadlines(titles) {
  console.log(titles)

  // const { a } = titles

  if (titles.data) {
    return (
      <Grid item key="1" align="center">
        <Typography justify="center">2022-01-01</Typography>
        <Link href="https://publico.pt" target="_blank">
          <Typography justify="center">
            Cavaco acusa Costa de ″empurrar para a frente″ problemas de fundo da
            economia
          </Typography>
        </Link>
      </Grid>
    )
    /*
    return titles.data.map((item, index) => (
      <Grid item key={index} align="center">
        <Typography justify="center">{item.date}</Typography>
        <Link href={item.url} target="_blank">
          <Typography justify="center">{item.title}</Typography>
        </Link>
      </Grid>
    ))
    */
  }
  return <CircularIndeterminate />
}

function FetchPersonalidadeHeadlines() {
  const { id } = useParams()
  const [headlines, setHeadlines] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const fetchData = () => {
    fetch(`http://localhost:8000/personality/relationships/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setHeadlines(data)
        console.log(data)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(true)
        console.log(error)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return <CircularIndeterminate />
  }

  return (
    <Grid container direction="row" spacing={3} columns={16}>
      {headlines && <PersonalidadeHeadlines data={headlines} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default FetchPersonalidadeHeadlines
