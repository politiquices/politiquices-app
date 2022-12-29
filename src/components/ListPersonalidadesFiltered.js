import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Link from '@material-ui/core/Link'
import { Typography } from '@mui/material'

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
    <Grid
      item
      key={entry.wiki_id}
      width={250}
      align="center"
      columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
    >
      <Link justify="center" href={`${baseURL}/personalidade/${entry.wiki_id}`}>
        <Avatar
          alt={entry.label}
          src={entry.url_image}
          sx={{ width: 125, height: 125 }}
        />
        {entry.label}{' '}
      </Link>
      <Typography justify="center" fontSize={2}>
        {entry.nr_articles} notícias
      </Typography>
    </Grid>
  ))
}

function FetchPersonalidades(requestType) {
  const Base = 'http://127.0.0.1:8000'
  let Full = ''
  // use object's key name to create variables and assign them with the value from the object for the same key
  const { type } = requestType
  const { id } = useParams()

  switch (type) {
    case 'education':
      Full = `${Base}/personalities/educated_at/${id}`
      break

    case 'occupation':
      Full = `${Base}/personalities/occupation/${id}`
      break

    case 'government':
      Full = `${Base}/personalities/government/${id}`
      break

    case 'assembly':
      Full = `${Base}/personalities/assembly/${id}`
      break

    case 'public_office':
      Full = `${Base}/personalities/public_office/${id}`
      break

    case 'party':
      Full = `${Base}/personalities/party/${id}`
      break

    default:
      console.log('ERROR')
  }

  const [data, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const fetchData = () => {
    fetch(Full)
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

    <Grid container direction="row" spacing={6} justifyContent="space-evenly">
      {' '}
      {/* style={gridStyles}> */}
      {data && <ListPersonalidadesFiltered data={data} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default FetchPersonalidades
