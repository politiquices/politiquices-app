import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Link from '@material-ui/core/Link'
import { Typography } from '@mui/material'
import CircularIndeterminate from './utils/Circular'

function ListPersonalidades(personalities) {
  const headlines = personalities.data.map((rawData) => ({
    label: rawData.label,
    nr_articles: rawData.nr_articles,
    local_image: rawData.local_image,
    wiki_id: rawData.wiki_id,
  }))

  return headlines.map((entry) => (
    <Grid item key={entry.wiki_id} width={250} align="center" columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
      <Link justify="center" href={`personalidade/${entry.wiki_id}`}>
        <Avatar alt={entry.focus_ent} src={entry.local_image} sx={{ width: 125, height: 125 }} />
        {entry.label}
      </Link>
      <Typography justify="center" fontSize={2}>
        {entry.nr_articles} notícias
      </Typography>
    </Grid>
  ))
}

function FetchPersonalidades() {
  const [data, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/personalities/`)
      .then((response) => response.json())
      .then((personalities) => {
        setIsLoading(false)
        setNotes(personalities)
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

  if (isLoading || !data) {
    console.log('loading')
    return <CircularIndeterminate />
  }
  return (
    <Grid container direction="row" spacing={6} justifyContent="space-evenly" sx={{ paddingTop: 10 }}>
      {data && <ListPersonalidades data={data} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default FetchPersonalidades
