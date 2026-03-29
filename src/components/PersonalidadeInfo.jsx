/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import { SiWikidata } from 'react-icons/si'
import { HiAcademicCap } from 'react-icons/hi'
import NewsTitles from './utils/NewsTitles'
import ArticlesYearBar from './utils/ArticlesYearBar'
import TopRelated from './TopRelated'
import PersonalidadeGraph from './PersonalidadeGraph'
import CircularIndeterminate from './utils/Circular'
import { getPersonality, getPersonalityRelationships, getPersonalityTopRelated } from '../api'


function FillIn(elements, url) {
  const completeURL = window.location.href
  const baseURL = completeURL.replace(window.location.pathname, '')

  const { length } = elements
  if (length > 0) {
    return elements.map((item) => (
      <Link key={item.wiki_id.split('/').at(-1)} href={`${baseURL}/${url}/${item.wiki_id.split('/').at(-1)}`}>
        <Typography sx={{ mb: 0.5 }} color="text.secondary">
          {item.label}
        </Typography>
      </Link>
    ))
  }
  return (
    <Typography sx={{ mb: 0.5 }} color="text.secondary">
      -
    </Typography>
  )
}


function InfoSection({ label, children }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      <Box>{children}</Box>
    </Box>
  )
}


function PersonalidadeInfo({ data }) {
  const wikiURL = `http://www.wikidata.org/wiki/${data.wiki_id}`
  const baseURL = window.location.href.replace(window.location.pathname, '')

  return (
    <Box sx={{ paddingTop: 10 }}>
      {/* Hero card */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* Avatar + name + wiki */}
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={data.name}
              src={data.image_url}
              sx={{ width: 160, height: 160, mx: 'auto', mb: 1 }}
            />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {data.name}
            </Typography>
            <Link href={wikiURL} target="_blank" title="Ver no Wikidata">
              <SiWikidata size={28} />
            </Link>
          </Grid>

          {/* Party logos + info fields */}
          <Grid item xs={12} sm={9}>
            {/* Party logos */}
            {data.parties && data.parties.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Partido(s)
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.5 }}>
                  {data.parties.map((entry) => (
                    <Link key={entry.wiki_id} href={`${baseURL}/party/${entry.wiki_id}`}>
                      <img width="60" src={entry.image_url} alt={entry.name} title={entry.name} />
                    </Link>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Info fields in 3 columns */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <InfoSection label="Profissões">
                  {!data.occupations ? <Typography color="text.secondary">-</Typography> : FillIn(data.occupations, 'occupation')}
                </InfoSection>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InfoSection label="Cargos Públicos">
                  {!data.positions ? <Typography color="text.secondary">-</Typography> : FillIn(data.positions, 'public_office')}
                </InfoSection>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InfoSection label="Mandatos">
                  {!data.governments ? <Typography color="text.secondary">-</Typography> : FillIn(data.governments, 'government')}
                  {!data.assemblies ? null : FillIn(data.assemblies, 'assembly')}
                </InfoSection>
              </Grid>
            </Grid>

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <HiAcademicCap size={20} />
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    Educação
                  </Typography>
                </Stack>
                {FillIn(data.education, 'education')}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

    </Box>
  )
}


const NEWS_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'ent1_supports_ent2', label: 'Apoia' },
  { value: 'ent1_opposes_ent2', label: 'Opõe-se' },
]
const PAGE_SIZE = 10


function FetchPersonalidade() {
  const { id } = useParams()
  const [info, setInfo] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [topRelated, setTopRelated] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [newsFilter, setNewsFilter] = useState('all')
  const [newsPage, setNewsPage] = useState(1)
  const [selectedEdge, setSelectedEdge] = useState(null)

  const fetchData = () => {
    getPersonality(id).then(setInfo).catch(() => { setIsLoading(false); setIsError(true) })
  }

  const fetchDataHeadlines = () => {
    getPersonalityRelationships(id).then(setHeadlines).catch(() => { setIsLoading(false); setIsError(true) })
  }

  const fetchTopRelated = () => {
    getPersonalityTopRelated(id).then(setTopRelated).catch(() => { setIsLoading(false); setIsError(true) })
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

  const topRelatedData = {
    relationships: topRelated,
    wiki_id: info.wiki_id,
  }

  const allArticles = headlines.sentiment ?? []

  const edgeArticles = selectedEdge
    ? allArticles.filter((a) =>
        (a.ent1_id === selectedEdge.from && a.ent2_id === selectedEdge.to) ||
        (a.ent1_id === selectedEdge.to && a.ent2_id === selectedEdge.from)
      )
    : allArticles

  const filteredArticles = newsFilter === 'all'
    ? edgeArticles
    : edgeArticles.filter((a) => a.rel_type === newsFilter)

  const pagedArticles = filteredArticles.slice((newsPage - 1) * PAGE_SIZE, newsPage * PAGE_SIZE)

  const handleFilterChange = (value) => {
    setNewsFilter(value)
    setNewsPage(1)
  }

  const handleEdgeClick = (edge) => {
    setSelectedEdge(edge)
    setNewsPage(1)
  }

  const handleClearEdge = () => {
    setSelectedEdge(null)
    setNewsPage(1)
  }

  return (
    <div>
      {info && <PersonalidadeInfo data={info} />}

      {/* Graph */}
      {topRelated && (
        <PersonalidadeGraph
          topRelated={topRelated}
          mainId={info.wiki_id}
          mainName={info.name}
          mainImageUrl={info.image_url}
          onEdgeClick={handleEdgeClick}
          onBackgroundClick={handleClearEdge}
        />
      )}

      {/* News */}
      <Box sx={{ mt: 1 }}>
          {/* Active edge indicator */}
          {selectedEdge && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, mb: 1 }}>
              <Chip
                label={`${selectedEdge.from} ${selectedEdge.label} ${selectedEdge.to}`}
                onDelete={handleClearEdge}
                color="primary"
                size="small"
              />
            </Box>
          )}

          {/* Sentiment filter chips */}
          <Box sx={{ display: 'flex', gap: 1, px: 1, pb: 1 }}>
            {NEWS_FILTERS.map((f) => {
              const count = f.value === 'all'
                ? edgeArticles.length
                : edgeArticles.filter((a) => a.rel_type === f.value).length
              return (
                <Chip
                  key={f.value}
                  label={`${f.label} (${count})`}
                  onClick={() => handleFilterChange(f.value)}
                  variant={newsFilter === f.value ? 'filled' : 'outlined'}
                  color={newsFilter === f.value ? 'primary' : 'default'}
                  clickable
                />
              )
            })}
          </Box>

          {headlines.sentiment && <NewsTitles data={pagedArticles} />}
          {isError && <div>Error fetching data.</div>}

          {filteredArticles.length > PAGE_SIZE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <Pagination
                count={Math.ceil(filteredArticles.length / PAGE_SIZE)}
                page={newsPage}
                onChange={(_, value) => setNewsPage(value)}
                color="primary"
              />
            </Box>
          )}
      </Box>

      <ArticlesYearBar data={info.relationships_charts} />

      {topRelated && <TopRelated data={topRelatedData} />}
    </div>
  )
}

export default FetchPersonalidade
