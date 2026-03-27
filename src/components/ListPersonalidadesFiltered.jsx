import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import { getPersonalitiesFiltered } from '../api'

function ListPersonalidadesFiltered(personalities) {
  const headlines = personalities.data.map((rawData) => ({
    wiki_id: rawData.ent1.value.split('/').at(-1),
    label: rawData.ent1_name.value,
    url_image: rawData.image_url.value,
    nr_articles: rawData.nr_articles,
  }))

  // to remove the last part of the current URL
  const fullURL = window.location.href
  const baseURL = fullURL.replace(window.location.pathname, '')

  return headlines.map((entry) => (
    <Grid item key={entry.wiki_id} width={250} align="center" columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
      <Link justify="center" href={`${baseURL}/personalidade/${entry.wiki_id}`}>
        <Avatar alt={entry.label} src={entry.url_image} sx={{ width: 125, height: 125 }} />
        {entry.label}{' '}
      </Link>
    </Grid>
  ))
}

function FetchPersonalidades(requestType) {
  const { type } = requestType
  const { id } = useParams()

  const [data, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const fetchData = () => {
    setIsLoading(true)
    getPersonalitiesFiltered(type, id)
      .then((personalities) => {
        setIsLoading(false)
        setNotes(personalities)
      })
      .catch(() => {
        setIsLoading(false)
        setIsError(true)
      })
  }
  useEffect(() => {
    fetchData()
  }, [type, id])
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    // xs, sm, md, lg, xl
    // xs - default
    // sm - min width 600px
    // md - min width 960px
    // lg - min width 1280px
    // xl - min width 1920px

    <Grid container direction="row" spacing={6} justifyContent="space-evenly" sx={{ paddingTop: 10 }}>
      {data && <ListPersonalidadesFiltered data={data} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default FetchPersonalidades
