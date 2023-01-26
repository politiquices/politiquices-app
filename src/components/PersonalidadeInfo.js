/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
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
import CircularIndeterminate from './utils/Circular'

const chartsRels = [
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 1994 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 1995 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 1996 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 1997 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 1998 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 1999 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 2000 },
  { opposes: 2, supports: 0, opposed_by: 0, supported_by: 0, year: 2001 },
  { opposes: 1, supports: 0, opposed_by: 0, supported_by: 0, year: 2002 },
  { opposes: 0, supports: 0, opposed_by: 0, supported_by: 0, year: 2003 },
  { opposes: 4, supports: 2, opposed_by: 10, supported_by: 5, year: 2004 },
  { opposes: 15, supports: 11, opposed_by: 36, supported_by: 8, year: 2005 },
  { opposes: 6, supports: 9, opposed_by: 21, supported_by: 4, year: 2006 },
  { opposes: 7, supports: 7, opposed_by: 26, supported_by: 3, year: 2007 },
  { opposes: 9, supports: 6, opposed_by: 43, supported_by: 5, year: 2008 },
  { opposes: 16, supports: 11, opposed_by: 75, supported_by: 15, year: 2009 },
  { opposes: 35, supports: 23, opposed_by: 92, supported_by: 20, year: 2010 },
  { opposes: 69, supports: 18, opposed_by: 203, supported_by: 43, year: 2011 },
  { opposes: 0, supports: 1, opposed_by: 25, supported_by: 6, year: 2012 },
  { opposes: 9, supports: 4, opposed_by: 23, supported_by: 6, year: 2013 },
  { opposes: 13, supports: 10, opposed_by: 57, supported_by: 22, year: 2014 },
  { opposes: 29, supports: 15, opposed_by: 55, supported_by: 18, year: 2015 },
  { opposes: 38, supports: 14, opposed_by: 35, supported_by: 6, year: 2016 },
  { opposes: 23, supports: 7, opposed_by: 31, supported_by: 8, year: 2017 },
  { opposes: 11, supports: 8, opposed_by: 21, supported_by: 9, year: 2018 },
  { opposes: 25, supports: 8, opposed_by: 43, supported_by: 7, year: 2019 },
  { opposes: 7, supports: 1, opposed_by: 16, supported_by: 3, year: 2020 },
  { opposes: 4, supports: 0, opposed_by: 4, supported_by: 1, year: 2021 },
  { opposes: 0, supports: 0, opposed_by: 1, supported_by: 0, year: 2022 },
]

const charts = [
  {
    country: 'AD',
    'hot dog': 151,
    'hot dogColor': 'hsl(64, 70%, 50%)',
    burger: 140,
    burgerColor: 'hsl(329, 70%, 50%)',
    sandwich: 172,
    sandwichColor: 'hsl(147, 70%, 50%)',
    kebab: 64,
    kebabColor: 'hsl(138, 70%, 50%)',
    fries: 154,
    friesColor: 'hsl(263, 70%, 50%)',
    donut: 119,
    donutColor: 'hsl(356, 70%, 50%)',
  },
  {
    country: 'AE',
    'hot dog': 141,
    'hot dogColor': 'hsl(224, 70%, 50%)',
    burger: 6,
    burgerColor: 'hsl(47, 70%, 50%)',
    sandwich: 27,
    sandwichColor: 'hsl(38, 70%, 50%)',
    kebab: 62,
    kebabColor: 'hsl(322, 70%, 50%)',
    fries: 1,
    friesColor: 'hsl(219, 70%, 50%)',
    donut: 74,
    donutColor: 'hsl(142, 70%, 50%)',
  },
  {
    country: 'AF',
    'hot dog': 57,
    'hot dogColor': 'hsl(311, 70%, 50%)',
    burger: 52,
    burgerColor: 'hsl(253, 70%, 50%)',
    sandwich: 6,
    sandwichColor: 'hsl(353, 70%, 50%)',
    kebab: 83,
    kebabColor: 'hsl(302, 70%, 50%)',
    fries: 113,
    friesColor: 'hsl(59, 70%, 50%)',
    donut: 62,
    donutColor: 'hsl(277, 70%, 50%)',
  },
  {
    country: 'AG',
    'hot dog': 45,
    'hot dogColor': 'hsl(92, 70%, 50%)',
    burger: 35,
    burgerColor: 'hsl(100, 70%, 50%)',
    sandwich: 129,
    sandwichColor: 'hsl(16, 70%, 50%)',
    kebab: 161,
    kebabColor: 'hsl(251, 70%, 50%)',
    fries: 53,
    friesColor: 'hsl(22, 70%, 50%)',
    donut: 75,
    donutColor: 'hsl(9, 70%, 50%)',
  },
  {
    country: 'AI',
    'hot dog': 130,
    'hot dogColor': 'hsl(221, 70%, 50%)',
    burger: 85,
    burgerColor: 'hsl(20, 70%, 50%)',
    sandwich: 28,
    sandwichColor: 'hsl(3, 70%, 50%)',
    kebab: 50,
    kebabColor: 'hsl(155, 70%, 50%)',
    fries: 55,
    friesColor: 'hsl(337, 70%, 50%)',
    donut: 18,
    donutColor: 'hsl(291, 70%, 50%)',
  },
  {
    country: 'AL',
    'hot dog': 17,
    'hot dogColor': 'hsl(60, 70%, 50%)',
    burger: 149,
    burgerColor: 'hsl(269, 70%, 50%)',
    sandwich: 160,
    sandwichColor: 'hsl(7, 70%, 50%)',
    kebab: 103,
    kebabColor: 'hsl(71, 70%, 50%)',
    fries: 165,
    friesColor: 'hsl(112, 70%, 50%)',
    donut: 82,
    donutColor: 'hsl(322, 70%, 50%)',
  },
  {
    country: 'AM',
    'hot dog': 106,
    'hot dogColor': 'hsl(88, 70%, 50%)',
    burger: 94,
    burgerColor: 'hsl(125, 70%, 50%)',
    sandwich: 67,
    sandwichColor: 'hsl(330, 70%, 50%)',
    kebab: 55,
    kebabColor: 'hsl(117, 70%, 50%)',
    fries: 80,
    friesColor: 'hsl(247, 70%, 50%)',
    donut: 54,
    donutColor: 'hsl(318, 70%, 50%)',
  },
]

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
  console.log(data)

  const colors = { opposes: '#FF0000', supports: '#44861E', opposed_by: '#980000', supported_by: '#70DA33' }
  const getColor = (bar) => colors[bar.id]

  return (
    <ResponsiveBar
      data={data.data}
      keys={['opposes', 'supports', 'opposed_by', 'supported_by']}
      indexBy="year"
      margin={{ top: 50, right: 130, bottom: 150, left: 150 }}
      padding={0.3}
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
        legend: 'country',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'food',
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
          anchor: 'bottom-right',
          direction: 'column',
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
      role="application"
      ariaLabel="Nivo bar chart demo"
    />
  )
}

function PersonalidadeInfo({ data }) {
  const wikiURL = `http://www.wikidata.org/wiki/${data.wiki_id}`
  const baseURL = window.location.href.replace(window.location.pathname, '')

  return (
    <>
      <Box sx={{ flexGrow: 1, paddingTop: 2 }}>
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
      <Link href={`/personalidade_news/${data.wiki_id}`}>
        <center>noticias</center>
      </Link>
      <div style={{ height: 500 }}>
        <ArticlesYearBar data={data.relationships_charts} />
      </div>
    </>
  )
}

function FetchPersonalidade() {
  const { id } = useParams()
  const [notes, setNotes] = useState([])
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

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading || !notes.relationships_charts) {
    return <CircularIndeterminate />
  }

  notes.wiki_id = id

  return (
    <div>
      {notes && <PersonalidadeInfo data={notes} />}
      {isError && <div>Error fetching data.</div>}
    </div>
  )
}

export default FetchPersonalidade
