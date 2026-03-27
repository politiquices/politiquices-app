/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { SiWikidata } from 'react-icons/si'
import { HiAcademicCap } from 'react-icons/hi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button';
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'
import { MIN_YEAR as minYear, MAX_YEAR as maxYear } from '../constants'


function FillIn(elements, url) {
  // to remove the last part of the current URL
  const completeURL = window.location.href
  const baseURL = completeURL.replace(window.location.pathname, '')

  const { length } = elements
  if (length > 0) {
    // eslint-disable-next-line react/destructuring-assignment
    return elements.map((item) => (
      <Link key={item.wiki_id.split('/').at(-1)} href={`${baseURL}/${url}/${item.wiki_id.split('/').at(-1)}`}>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {item.label}
        </Typography>
      </Link>
    ))
  }
  return (
    <Typography sx={{ mb: 1.5 }} color="text.secondary">
      -
    </Typography>
  )
}

function ArticlesYearBar({ data }) {
  const [showChart, setShowChart] = useState(true);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setShowChart(!showChart)}>
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </Button>
      </Box>
      {showChart && (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} margin={{ top: 20, right: 150, bottom: 20, left: 150 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar dataKey="opposes" fill="#FF0000" />
            <Bar dataKey="supports" fill="#44861E" />
            <Bar dataKey="opposed_by" fill="#980000" />
            <Bar dataKey="supported_by" fill="#70DA33" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function PersonalidadeInfo({ data }) {
  const wikiURL = `http://www.wikidata.org/wiki/${data.wiki_id}`
  const baseURL = window.location.href.replace(window.location.pathname, '')

  return (
    <>
      <Box sx={{ flexGrow: 1, paddingTop: 10 }}>
        <Grid
          container
          spacing={1}
          columns={14}
          alignItems="center"
          justifyContent="center"
          // style={gridStyles}
        >
          {/* Foto + Nome + WikiData link */}
          <Grid item xs={2}>
            <center>
              <Avatar alt={data.name} src={data.image_url} sx={{ width: 160, height: 160 }} />
              <Typography variant="h6" component="div">
                <b>{data.name}</b>
              </Typography>
              <Link href={wikiURL} target="_blank">
                <SiWikidata size={35} />
              </Link>
            </center>
          </Grid>

          {/* Partido(s) Político(s) */}
          <Grid item xs={2}>
            <center>
              {!data || !data.parties ? (
                <p>Loading...</p>
              ) : (
                data.parties.map((entry) => (
                  <Link key={entry.wiki_id} href={`${baseURL}/party/${entry.wiki_id}`}>
                    <div>
                      <img key="{index}" width="68" src={entry.image_url} alt={entry.name} />
                      <br />
                    </div>
                  </Link>
                ))
              )}
            </center>
          </Grid>

          {/* Profissão(ões) */}
          <Grid item xs={2}>
            {!data || !data.occupations ? <p>Loading...</p> : FillIn(data.occupations, 'occupation')}
          </Grid>

          {/* Cargos públicos */}
          <Grid item xs={2}>
            {!data || !data.positions ? <p>Loading...</p> : FillIn(data.positions, 'public_office')}
          </Grid>

          {/* Legislaturas - governos de que fez parte */}
          <Grid item xs={2}>
            {!data || !data.governments ? <p>Loading...</p> : FillIn(data.governments, 'government')}
          </Grid>

          {/* Assembleias de deputados de que fez parte */}
          <Grid item xs={2}>
            {!data || !data.assemblies ? <p>Loading...</p> : FillIn(data.assemblies, 'assembly')}
          </Grid>

          {/* Estudos */}
          <Grid item xs={2}>
            <HiAcademicCap size={35} />
            {!data || !data.education ? <p>Loading...</p> : FillIn(data.education, 'education')}
          </Grid>
        </Grid>
      </Box>
      <ArticlesYearBar data={data.relationships_charts} />
    </>
  )
}

function TopRelated(data) {
  if (data.data.relationships.who_opposes_person) {
    // sort by freq.
    data.data.relationships.who_opposes_person.sort((a, b) => b.freq - a.freq)
    data.data.relationships.who_supports_person.sort((a, b) => b.freq - a.freq)
    data.data.relationships.who_person_supports.sort((a, b) => b.freq - a.freq)
    data.data.relationships.who_person_opposes.sort((a, b) => b.freq - a.freq)

    const whoOpposesPerson = data.data.relationships.who_opposes_person.map((entry) => (
      <Stack spacing={1}>
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${entry.wiki_id}/${'ent1_opposes_ent2'}/${data.data.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    const whoSupportsPerson = data.data.relationships.who_supports_person.map((entry) => (
      <Stack spacing={1}>
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${entry.wiki_id}/${'ent1_supports_ent2'}/${data.data.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    const whoPersonSupports = data.data.relationships.who_person_supports.map((entry) => (
      <Stack spacing={1}>
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${data.data.wiki_id}/${'ent1_supports_ent2'}/${entry.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    const whoPersonOpposes = data.data.relationships.who_person_opposes.map((entry) => (
      <Stack spacing={1} align="center">
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${data.data.wiki_id}/${'ent1_opposes_ent2'}/${entry.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    return (
      <Grid container direction="row" spacing={1} justifyContent="space-evenly">
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Oposto Por</Typography>
          {whoOpposesPerson}
        </Box>
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Apoiado Por</Typography>
          {whoSupportsPerson}
        </Box>
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Apoia</Typography>
          {whoPersonSupports}
        </Box>
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Opõe-se</Typography>
          {whoPersonOpposes}
        </Box>
      </Grid>
    )
  }
  return null
}

function FetchPersonalidade() {
  const { id } = useParams()
  const [info, setInfo] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [topRelated, setTopRelated] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_POLITIQUICES_API}/personality/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setInfo(data)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(true)
        console.log(error)
      })
  }

  const fetchDataHeadlines = () => {
    fetch(`${import.meta.env.VITE_POLITIQUICES_API}/personality/relationships/${id}`)
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

  const fetchTopRelated = () => {
    fetch(`${import.meta.env.VITE_POLITIQUICES_API}/personality/top_related_personalities/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setTopRelated(data)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(true)
        console.log(error)
      })
  }

  useEffect(() => {
    fetchData()
    fetchDataHeadlines()
    fetchTopRelated()
  }, [id])

  if (isLoading || !info.relationships_charts || !headlines) {
    return <CircularIndeterminate />
  }

  info.wiki_id = id

  const myHonda = {
    relationships: topRelated,
    wiki_id: info.wiki_id,
  }

  return (
    <div>
      {info && <PersonalidadeInfo data={info} />}
      {topRelated && <TopRelated data={myHonda} />}
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
        sx={{ paddingTop: 2 }}
      >
        {headlines.sentiment && <NewsTitles data={headlines.sentiment} />}
        {isError && <div>Error fetching data.</div>}
      </Grid>
    </div>
  )
}

export default FetchPersonalidade