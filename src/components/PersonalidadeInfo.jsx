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
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { SiWikidata } from 'react-icons/si'
import { HiAcademicCap } from 'react-icons/hi'
import NewsTitles from './utils/NewsTitles'
import ArticlesYearBar from './utils/ArticlesYearBar'
import PersonalidadeGraph from './PersonalidadeGraph'
import CircularIndeterminate from './utils/Circular'
import { getPersonality, getPersonalityRelationships, getPersonalityTopRelated } from '../api'


function FillIn(elements, url, baseURL) {
  if (!elements || elements.length === 0) {
    return (
      <Typography sx={{ mb: 0.5 }} color="text.secondary">-</Typography>
    )
  }
  return elements.map((item) => {
    const id = item.wiki_id.split('/').at(-1)
    return (
      <Link key={id} href={url ? `${baseURL}/${url}/${id}` : undefined}>
        <Typography sx={{ mb: 0.5 }} color="text.secondary">{item.label}</Typography>
      </Link>
    )
  })
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

            {/* Info fields as Accordions */}
            <Box sx={{ mt: 1 }}>
              {[
                { label: 'Profissões', items: data.occupations, url: 'occupation' },
                { label: 'Cargos Públicos', items: data.positions, url: 'public_office' },
                {
                  label: 'Mandatos',
                  items: [...(data.governments ?? []), ...(data.assemblies ?? [])],
                  url: null,
                  mixed: true,
                },
                { label: 'Educação', items: data.education, url: 'education', icon: <HiAcademicCap size={16} /> },
              ]
                .filter((s) => s.items && s.items.length > 0)
                .map((section) => (
                  <Accordion key={section.label} disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 0.5, borderRadius: '4px !important' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 36, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {section.icon}
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{section.label}</Typography>
                        <Typography variant="caption" color="text.secondary">({section.items.length})</Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0.5, pb: 1 }}>
                      {section.mixed
                        ? <>
                            {FillIn(data.governments ?? [], 'government', baseURL)}
                            {FillIn(data.assemblies ?? [], 'assembly', baseURL)}
                          </>
                        : FillIn(section.items, section.url, baseURL)
                      }
                    </AccordionDetails>
                  </Accordion>
                ))
              }
            </Box>
          </Grid>
        </Grid>
      </Paper>

    </Box>
  )
}


const PAGE_SIZE = 10


function FetchPersonalidade() {
  const { id } = useParams()
  const [info, setInfo] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [topRelated, setTopRelated] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

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

  const allArticles = headlines.sentiment ?? []

  const filteredArticles = selectedEdge
    ? allArticles.filter((a) =>
        (a.ent1_id === selectedEdge.from && a.ent2_id === selectedEdge.to) ||
        (a.ent1_id === selectedEdge.to && a.ent2_id === selectedEdge.from)
      )
    : allArticles

  const pagedArticles = filteredArticles.slice((newsPage - 1) * PAGE_SIZE, newsPage * PAGE_SIZE)

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
    </div>
  )
}

export default FetchPersonalidade
