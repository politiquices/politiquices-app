import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { getPersonalitiesFiltered, getParties } from '../api'
import { GOVERNMENTS, ASSEMBLIES } from '../constants'

function ListPersonalidadesFiltered(personalities) {
  const headlines = personalities.data.map((rawData) => ({
    wiki_id: rawData.ent1.value.split('/').at(-1),
    label: rawData.ent1_name.value,
    url_image: rawData.image_url.value,
    nr_articles: rawData.nr_articles,
  }))

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

function PartyHeader({ partyInfo, count }) {
  if (!partyInfo) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <img src={partyInfo.party_logo} alt={partyInfo.party_label} style={{ height: 60 }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
        {partyInfo.party_label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count} personalidades
      </Typography>
    </Box>
  )
}

function EntityHeader({ label, count }) {
  if (!label) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count} personalidades
      </Typography>
    </Box>
  )
}

function SelectorControl({ type, id }) {
  const navigate = useNavigate()

  if (type !== 'government' && type !== 'assembly') return null

  const items = type === 'government' ? GOVERNMENTS : ASSEMBLIES
  const label = type === 'government' ? 'Governo' : 'Assembleia'
  const basePath = type === 'government' ? '/government' : '/assembly'

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <FormControl size="small" sx={{ minWidth: 320 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={id}
          label={label}
          onChange={(e) => navigate(`${basePath}/${e.target.value}`)}
        >
          {items.map(([wikiId, name]) => (
            <MenuItem key={wikiId} value={wikiId}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

function FetchPersonalidades(requestType) {
  const { type } = requestType
  const { id } = useParams()

  const [data, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [partyInfo, setPartyInfo] = useState(null)

  useEffect(() => {
    if (type !== 'party') return
    getParties().then((parties) => {
      setPartyInfo(parties.find((p) => p.wiki_id === id) ?? null)
    }).catch(() => {})
  }, [type, id])

  useEffect(() => {
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
  }, [type, id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const entityLabel = (type === 'occupation' || type === 'education') && data.length > 0
    ? data[0].entity_label?.value
    : null

  return (
    <Box sx={{ paddingTop: 10, px: 2 }}>
      <PartyHeader partyInfo={partyInfo} count={data.length} />
      <EntityHeader label={entityLabel} count={data.length} />
      <SelectorControl type={type} id={id} />
      <Grid container direction="row" spacing={6} justifyContent="space-evenly">
        {data && <ListPersonalidadesFiltered data={data} />}
        {isError && <div>Error fetching data.</div>}
      </Grid>
    </Box>
  )
}

export default FetchPersonalidades
