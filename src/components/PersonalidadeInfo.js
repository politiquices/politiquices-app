/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { SiWikidata } from 'react-icons/si'
import { HiAcademicCap } from 'react-icons/hi'
import { ResponsiveBar } from '@nivo/bar'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'

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

function ArticlesYearBar(data) {
  const colors = { opposes: '#FF0000', supports: '#44861E', opposed_by: '#980000', supported_by: '#70DA33' }
  const getColor = (bar) => colors[bar.id]

  return (
    <ResponsiveBar
      data={data.data}
      keys={['opposes', 'supports', 'opposed_by', 'supported_by']}
      indexBy="year"
      margin={{ top: 50, right: 150, bottom: 150, left: 150 }}
      padding={0.3}
      groupMode="grouped"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={getColor}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#dc3545',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'top',
          direction: 'row',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
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
      <div style={{ height: 500 }}>
        <ArticlesYearBar data={data.relationships_charts} />
      </div>
    </>
  )
}

function FetchPersonalidade() {
  const { id } = useParams()
  const [notes, setNotes] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch(`http://127.0.0.1:8000/personality/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setNotes(data)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(true)
        console.log(error)
      })
  }

  const fetchDataHeadlines = () => {
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
    fetchDataHeadlines()
  }, [])

  if (isLoading || !notes.relationships_charts || !headlines) {
    return <CircularIndeterminate />
  }

  notes.wiki_id = id

  return (
    <div>
      {notes && <PersonalidadeInfo data={notes} />}
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
