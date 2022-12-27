import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
// import Link from '@material-ui/core/Link'
import CircularIndeterminate from './utils/Circular'

// https://blog.openreplay.com/data-fetching-techniques-with-react

function PersonalidadeHeadlines (titles) {
  console.log(titles)

  if (titles.data) {
    return (<Typography justify="center">Test</Typography>)
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
  } else {
    return (
      <React.Fragment>
        <CircularIndeterminate/>
      </React.Fragment>
    )
  }
}

const FetchPersonalidadeHeadlines = () => {
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
    return (
      <React.Fragment>
        <CircularIndeterminate/>
      </React.Fragment>
    )
  }

  return (
    <Grid container direction="row" spacing={3} columns={16}>
      {headlines && <PersonalidadeHeadlines data={headlines} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>

  )
}

export default FetchPersonalidadeHeadlines
