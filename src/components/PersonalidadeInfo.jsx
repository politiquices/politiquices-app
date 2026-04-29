/* eslint-disable react/destructuring-assignment */
import { useState, useEffect, useRef, useCallback } from 'react'
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
import PersonalidadeGraph from './PersonalidadeGraph'
import CircularIndeterminate from './utils/Circular'
import { getPersonality, getPersonalityRelationships, getPersonalityTopRelated } from '../api'
import { COLOR_SUPPORTS, COLOR_OPPOSES } from '../constants'
import { useTranslation } from 'react-i18next'


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
  const { t } = useTranslation()
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
                  {t('personality.parties')}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.5 }}>
                  {data.parties.map((entry) => (
                    <Link key={entry.wiki_id} href={`${baseURL}/party/${entry.wiki_id}`}>
                      <img
                        width="60"
                        src={entry.image_url}
                        alt=""
                        title={entry.name}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/logos/no_picture.jpg' }}
                      />
                    </Link>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Info fields as Accordions */}
            <Box sx={{ mt: 1 }}>
              {[
                { label: t('personality.occupations'), items: data.occupations, url: 'occupation' },
                { label: t('personality.publicOffices'), items: data.positions, url: 'public_office' },
                {
                  label: t('personality.mandates'),
                  items: [...(data.governments ?? []), ...(data.assemblies ?? [])],
                  url: null,
                  mixed: true,
                },
                { label: t('personality.education'), items: data.education, url: 'education', icon: <HiAcademicCap size={16} /> },
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
  const { t } = useTranslation()
  const { id } = useParams()
  const [info, setInfo] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [topRelated, setTopRelated] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [newsPage, setNewsPage] = useState(1)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [graphState, setGraphState] = useState({ visibleNodeIds: null, showSupports: true, showOpposes: true })

  // Cache of relationship articles keyed by node ID.
  // Starts with the main personality; grows as the graph expands to depth > 1.
  const [headlinesCache, setHeadlinesCache] = useState({})
  const headlinesCacheRef = useRef({})

  useEffect(() => {
    setInfo([])
    setHeadlines([])
    setTopRelated([])
    setSelectedEdge(null)
    setNewsPage(1)
    setHeadlinesCache({})
    headlinesCacheRef.current = {}
    setGraphState({ visibleNodeIds: null, showSupports: true, showOpposes: true })

    getPersonality(id).then(setInfo).catch(() => { setIsLoading(false); setIsError(true) })
    getPersonalityTopRelated(id).then(setTopRelated).catch(() => { setIsLoading(false); setIsError(true) })
    getPersonalityRelationships(id).then((data) => {
      setHeadlines(data)
      const initial = { [id]: data }
      setHeadlinesCache(initial)
      headlinesCacheRef.current = initial
    }).catch(() => { setIsLoading(false); setIsError(true) })
  }, [id])

  // Called by PersonalidadeGraph whenever new nodes are added to the graph cache.
  // Fetches relationship articles for those nodes (best-effort, depth > 1 only).
  const handleNodesChange = useCallback((newNodeIds) => {
    newNodeIds
      .filter((nodeId) => !headlinesCacheRef.current[nodeId])
      .forEach((nodeId) => {
        getPersonalityRelationships(nodeId)
          .then((data) => {
            headlinesCacheRef.current = { ...headlinesCacheRef.current, [nodeId]: data }
            setHeadlinesCache((prev) => ({ ...prev, [nodeId]: data }))
          })
          .catch(() => {})
      })
  }, [])

  const handleGraphChange = useCallback(({ visibleNodeIds, showSupports, showOpposes }) => {
    setGraphState({ visibleNodeIds, showSupports, showOpposes })
    setSelectedEdge(null)
    setNewsPage(1)
  }, [])

  if (isLoading || !info.relationships_charts || !headlines) {
    return <CircularIndeterminate />
  }

  info.wiki_id = id

  // Flatten all cached relationship articles into one pool.
  const allArticles = Object.values(headlinesCache).flatMap((h) => [
    ...(h.sentiment ?? []),
    ...(h.opposed_by ?? []),
    ...(h.supported_by ?? []),
    ...(h.other ?? []),
    ...(h.other_by ?? []),
  ])

  // Filter to nodes visible in the current graph state
  const visibleArticles = graphState.visibleNodeIds
    ? allArticles.filter((a) =>
        graphState.visibleNodeIds.has(a.ent1_id) && graphState.visibleNodeIds.has(a.ent2_id)
      )
    : allArticles

  // Filter by rel type matching the graph toggles (other always passes)
  const typeFilteredArticles = visibleArticles.filter((a) => {
    if (a.rel_type === 'supports' || a.rel_type === 'supported_by') return graphState.showSupports
    if (a.rel_type === 'opposes'  || a.rel_type === 'opposed_by')   return graphState.showOpposes
    return true
  })

  const rawFiltered = selectedEdge
    ? typeFilteredArticles.filter((a) => {
        const directMatch = a.ent1_id === selectedEdge.from && a.ent2_id === selectedEdge.to
        const reverseMatch = a.ent1_id === selectedEdge.to && a.ent2_id === selectedEdge.from
        if (!directMatch && !reverseMatch) return false
        if (selectedEdge.label === 'apoia') {
          if (directMatch) return a.rel_type === 'supports'
          return a.rel_type === 'supported_by'
        } else {
          if (directMatch) return a.rel_type === 'opposes'
          return a.rel_type === 'opposed_by'
        }
      })
    : typeFilteredArticles

  // Both caches may contain the same underlying article from different perspectives;
  // deduplicate by arquivo_doc URL so each article appears only once, then sort newest first.
  const seenUrls = new Set()
  const filteredArticles = rawFiltered
    .filter((a) => {
      const key = a.arquivo_doc || a.original_url
      if (seenUrls.has(key)) return false
      seenUrls.add(key)
      return true
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

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
          onNodesChange={handleNodesChange}
          onGraphChange={handleGraphChange}
        />
      )}

      {/* News */}
      {headlines.sentiment && (
        <Paper elevation={2} sx={{ p: 2, mt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mb: 1 }}>
            {[
              { key: 'supports',     label: t('personality.supports'),    color: COLOR_SUPPORTS },
              { key: 'opposes',      label: t('personality.opposes'),     color: COLOR_OPPOSES },
              { key: 'supported_by', label: t('personality.supportedBy'), color: '#66bb6a' },
              { key: 'opposed_by',   label: t('personality.opposedBy'),   color: '#ef9a9a' },
              { key: 'other',        label: t('personality.other'),        color: '#9e9e9e' },
            ].map(({ key, label, color }) => {
              const count = filteredArticles.filter(
                (a) => a.rel_type === key || (key === 'other' && a.rel_type === 'other_by')
              ).length
              if (count === 0) return null
              return (
                <Chip
                  key={key}
                  label={`${label}: ${count}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: color, color, fontWeight: 'bold' }}
                />
              )
            })}
          </Stack>

          <NewsTitles data={pagedArticles} />

          {isError && <Typography color="error">{t('common.error')}</Typography>}

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
        </Paper>
      )}

    </div>
  )
}

export default FetchPersonalidade
