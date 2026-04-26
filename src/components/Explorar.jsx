import { useState, useEffect, useRef, useMemo } from 'react'
import Select from 'react-select'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import useVisNetwork from '../hooks/useVisNetwork.jsx'
import { useRelTypeToggle } from '../hooks/useRelTypeToggle'
import NewsTitles from './utils/NewsTitles'
import { MIN_YEAR, MAX_YEAR, COLOR_SUPPORTS, COLOR_OPPOSES, COLOR_SUPPORTS_BG, COLOR_OPPOSES_BG, GOVERNMENTS, ASSEMBLIES } from '../constants'
import { getPersons, getTimeline, getPersonalityTopRelated, getPersonalityRelationships, getPersonalitiesFiltered } from '../api'
import { entityId } from '../utils'
import { useTranslation } from 'react-i18next'

const PAGE_SIZE = 10

function localizeLabel(label, t) {
  return label
    .replace('Governo', t('constants.government'))
    .replace('Legislatura', t('constants.legislature'))
}

function parseYearsFromLabel(label) {
  const match = label.match(/\((\d{4})\s*-\s*(\d{4})?/)
  if (!match) return null
  const start = parseInt(match[1], 10)
  const end = match[2] ? parseInt(match[2], 10) : MAX_YEAR
  return [Math.max(start, MIN_YEAR), Math.min(end, MAX_YEAR)]
}

function enrichNodes(nodes) {
  return nodes.map((node) => ({
    ...node,
    shape: 'circularImage',
    image: node.image_url,
    size: 30,
    borderWidth: 2,
    color: { border: '#1976d2' },
  }))
}

// Build extra nodes/edges from topRelated cache for depth > 1
function buildExtraGraph(dataCache, baseNodeIds, showSupports, showOpposes, minFreq) {
  const nodesMap = new Map()
  const edgesSet = new Set()
  const edges = []
  let edgeId = 100000

  for (const nodeId of baseNodeIds) {
    const data = dataCache[nodeId]
    if (!data) continue

    const rels = []
    if (showSupports) {
      ;(data.who_supports_person ?? []).forEach((e) =>
        rels.push({ ...e, from: entityId(e.wiki_id), to: nodeId, relType: 'apoia' })
      )
      ;(data.who_person_supports ?? []).forEach((e) =>
        rels.push({ ...e, from: nodeId, to: entityId(e.wiki_id), relType: 'apoia' })
      )
    }
    if (showOpposes) {
      ;(data.who_opposes_person ?? []).forEach((e) =>
        rels.push({ ...e, from: entityId(e.wiki_id), to: nodeId, relType: 'opõe-se' })
      )
      ;(data.who_person_opposes ?? []).forEach((e) =>
        rels.push({ ...e, from: nodeId, to: entityId(e.wiki_id), relType: 'opõe-se' })
      )
    }

    rels
      .filter((e) => e.freq >= minFreq)
      .forEach((entry) => {
        const entId = entityId(entry.wiki_id)
        if (!baseNodeIds.has(entId) && !nodesMap.has(entId)) {
          nodesMap.set(entId, {
            id: entId,
            label: entry.name,
            shape: 'circularImage',
            image: entry.image_url,
            size: 22,
            borderWidth: 1,
          })
        }
        const key = `${entry.from}|${entry.to}|${entry.relType}`
        if (!edgesSet.has(key)) {
          edgesSet.add(key)
          edges.push({
            id: edgeId++,
            from: entry.from,
            to: entry.to,
            title: entry.relType,
            value: Math.log1p(entry.freq),
            color: entry.relType === 'apoia' ? COLOR_SUPPORTS : COLOR_OPPOSES,
          })
        }
      })
  }

  return { extraNodes: Array.from(nodesMap.values()), extraEdges: edges }
}

function GraphControls({ depth, setDepth, minNoticias, setMinNoticias, relTypeValue, handleRelTypeChange, isExpandLoading, onReset }) {
  const { t } = useTranslation()
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{t('explore.depth')}</Typography>
        <ToggleButtonGroup value={depth} exclusive onChange={(_, v) => { if (v !== null) setDepth(v) }} size="small">
          {[1, 2, 3].map((d) => (
            <ToggleButton key={d} value={d} sx={{ px: 1.5, py: 0.5 }}>{d}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{t('explore.minNews')}</Typography>
        <TextField
          type="number"
          value={minNoticias}
          onChange={(e) => setMinNoticias(Math.max(1, parseInt(e.target.value) || 1))}
          size="small"
          inputProps={{ min: 1, style: { width: 48, padding: '4px 8px' } }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{t('explore.type')}</Typography>
        <ToggleButtonGroup value={relTypeValue} onChange={handleRelTypeChange} size="small">
          <ToggleButton value="supports" sx={{ px: 1.5, py: 0.5, color: COLOR_SUPPORTS, '&.Mui-selected': { bgcolor: COLOR_SUPPORTS_BG, color: COLOR_SUPPORTS } }}>
            {t('explore.supports')}
          </ToggleButton>
          <ToggleButton value="opposes" sx={{ px: 1.5, py: 0.5, color: COLOR_OPPOSES, '&.Mui-selected': { bgcolor: COLOR_OPPOSES_BG, color: COLOR_OPPOSES } }}>
            {t('explore.opposes')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {isExpandLoading && <CircularProgress size={18} />}
      <Button size="small" variant="outlined" onClick={onReset} sx={{ textTransform: 'none' }}>
        {t('explore.resetLayout')}
      </Button>
    </Stack>
  )
}

function GraphCanvas({ nodes, edges, yearsValues, onEdgeClick, onBackgroundClick, onFullscreen, fullscreen, resetRef }) {
  const { t } = useTranslation()
  const { container, nodePopover, edgePopover, resetLayout } = useVisNetwork({
    nodes,
    edges,
    Yearsvalues: yearsValues,
    onEdgeClick,
    onBackgroundClick,
  })

  useEffect(() => {
    if (resetRef) resetRef.current = resetLayout
  }, [resetLayout, resetRef])
  return (
    <>
      {nodePopover}
      {edgePopover}
      <Box sx={fullscreen ? { position: 'absolute', inset: 0 } : { position: 'relative' }}>
        <Box
          ref={container}
          sx={{ width: '100%', height: fullscreen ? '100%' : 500, border: '1px solid #ccc', borderRadius: 1 }}
        />
        {/* Fullscreen toggle — top-right */}
        <IconButton
          size="small"
          onClick={onFullscreen}
          sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
        >
          {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
        </IconButton>
        {/* Legend overlay — bottom-right */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.85)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            pointerEvents: 'none',
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLOR_SUPPORTS }} />
            <Typography variant="caption" color="text.secondary">{t('explore.supportsLegend')}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLOR_OPPOSES }} />
            <Typography variant="caption" color="text.secondary">{t('explore.opposesLegend')}</Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

function Explorar() {
  const { t } = useTranslation()
  const [personalities, setPersonalities] = useState([])
  const [selectedOption, setSelectedOption] = useState([
    { label: 'José Sócrates', value: 'Q182367' },
    { label: 'Pedro Passos Coelho', value: 'Q57615' },
    { label: 'António Costa', value: 'Q610788' },
  ])
  const [yearsValues, setYearsValues] = useState([2000, MAX_YEAR])
  // Graph display controls (client-side, no re-fetch needed)
  const [depth, setDepth] = useState(1)
  const [minNoticias, setMinNoticias] = useState(10)
  const { showSupports, showOpposes, relTypeValue, handleRelTypeChange } = useRelTypeToggle()

  // Base graph from getTimeline
  const [baseNodes, setBaseNodes] = useState([])
  const [baseEdges, setBaseEdges] = useState([])
  const [news, setNews] = useState([])

  // Cache for depth > 1 expansion (topRelated per node)
  const [dataCache, setDataCache] = useState({})
  const dataCacheRef = useRef({})

  // Articles cache per node (fetched via getPersonalityRelationships)
  const [newsCache, setNewsCache] = useState({})
  const newsCacheRef = useRef({})

  const [loading, setLoading] = useState(false)
  const [isExpandLoading, setIsExpandLoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [isError, setIsError] = useState(false)
  const [presetGoverno, setPresetGoverno] = useState('')
  const [presetAssembly, setPresetAssembly] = useState('')
  const [presetLoading, setPresetLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const resetLayoutRef = useRef(null)

  const [selectedEdge, setSelectedEdge] = useState(null)
  const [newsPage, setNewsPage] = useState(1)

  useEffect(() => {
    dataCacheRef.current = dataCache
  }, [dataCache])

  useEffect(() => {
    getPersons().then(setPersonalities).catch(() => setIsError(true))
  }, [])

  const handlePresetSelect = (type, wikiId) => {
    if (type === 'government') {
      setPresetGoverno(wikiId)
      setPresetAssembly('')
    } else {
      setPresetAssembly(wikiId)
      setPresetGoverno('')
    }
    if (!wikiId) { setSelectedOption([]); return }

    const items = type === 'government' ? GOVERNMENTS : ASSEMBLIES
    const entry = items.find(([id]) => id === wikiId)

    setPresetLoading(true)
    getPersonalitiesFiltered(type, wikiId)
      .then((results) => {
        const options = results
          .filter((r) => r.nr_articles > 0)
          .map((r) => ({
            label: r.ent1_name.value,
            value: r.ent1.value.split('/').at(-1),
          }))
        setSelectedOption(options)
        if (entry) {
          const years = parseYearsFromLabel(entry[1])
          if (years) setYearsValues(years)
        }
      })
      .catch(() => {})
      .finally(() => setPresetLoading(false))
  }

  const handleClick = () => {
    const persons = selectedOption ? selectedOption.map((a) => a.value) : []
    const [min, max] = yearsValues
    setLoading(true)
    setSelectedEdge(null)
    setNewsPage(1)
    setDataCache({})
    dataCacheRef.current = {}
    setNewsCache({})
    newsCacheRef.current = {}
    setDepth(1)
    getTimeline({ persons, onlyAmongSelected: true, onlySentiment: true, start: min, end: max, minFreq: minNoticias })
      .then((data) => {
        setBaseNodes(enrichNodes(data.nodes ?? []))
        setBaseEdges(data.edges ?? [])
        setNews((data.news ?? []).map((a) => ({
          ...a,
          rel_type: a.rel_type.includes('supports') ? 'supports'
                  : a.rel_type.includes('opposes')  ? 'opposes'
                  : a.rel_type,
        })))
        setHasResults(true)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setIsError(true)
      })
  }

  // Fetch topRelated for base nodes when depth > 1
  useEffect(() => {
    if (!hasResults || depth === 1 || baseNodes.length === 0) return

    let cancelled = false

    async function fetchMissing() {
      setIsExpandLoading(true)
      const missing = baseNodes
        .map((n) => n.id)
        .filter((id) => !dataCacheRef.current[id])

      if (missing.length === 0) { setIsExpandLoading(false); return }

      const results = await Promise.all(
        missing.map((id) =>
          getPersonalityTopRelated(id)
            .then((data) => ({ id, data }))
            .catch(() => ({ id, data: null }))
        )
      )

      if (cancelled) return

      const newEntries = {}
      results.forEach(({ id, data }) => { if (data) newEntries[id] = data })
      dataCacheRef.current = { ...dataCacheRef.current, ...newEntries }
      setDataCache((prev) => ({ ...prev, ...newEntries }))
      setIsExpandLoading(false)
    }

    fetchMissing()
    return () => { cancelled = true }
  }, [depth, hasResults, baseNodes])

  // Compute displayed nodes and edges
  const { displayedNodes, displayedEdges } = useMemo(() => {
    const baseNodeIds = new Set(baseNodes.map((n) => n.id))

    // Filter base edges by relation type and min frequency
    const filteredBase = baseEdges.filter((e) =>
      ((showSupports && e.title === 'apoia') ||
       (showOpposes && e.title === 'opõe-se')) &&
      e.value >= minNoticias
    )

    if (depth === 1) {
      return { displayedNodes: baseNodes, displayedEdges: filteredBase }
    }

    const { extraNodes, extraEdges } = buildExtraGraph(
      dataCache, baseNodeIds, showSupports, showOpposes, minNoticias
    )
    const filteredExtra = extraEdges.filter((e) =>
      (showSupports && e.title === 'apoia') ||
      (showOpposes && e.title === 'opõe-se')
    )

    return {
      displayedNodes: [...baseNodes, ...extraNodes],
      displayedEdges: [...filteredBase, ...filteredExtra],
    }
  }, [baseNodes, baseEdges, dataCache, depth, showSupports, showOpposes, minNoticias])

  // Fetch articles for nodes not yet in newsCache whenever displayedNodes changes
  useEffect(() => {
    const missing = displayedNodes.map((n) => n.id).filter((id) => !newsCacheRef.current[id])
    if (missing.length === 0) return

    const relTypeMap = {
      supports: 'supports',
      opposes: 'opposes',
      supported_by: 'supports',
      opposed_by: 'opposes',
    }

    Promise.all(
      missing.map((id) =>
        getPersonalityRelationships(id)
          .then((data) => ({ id, data }))
          .catch(() => ({ id, data: null }))
      )
    ).then((results) => {
      const newEntries = {}
      results.forEach(({ id, data }) => {
        if (!data) return
        const articles = [
          ...(data.sentiment ?? []),
          ...(data.opposed_by ?? []),
          ...(data.supported_by ?? []),
        ].map((a) => ({ ...a, rel_type: relTypeMap[a.rel_type] ?? a.rel_type }))
        newEntries[id] = articles
      })
      newsCacheRef.current = { ...newsCacheRef.current, ...newEntries }
      setNewsCache((prev) => ({ ...prev, ...newEntries }))
    })
  }, [displayedNodes])

  const handleEdgeClick = (edge) => {
    setSelectedEdge(edge)
    setNewsPage(1)
  }

  const handleClearEdge = () => {
    setSelectedEdge(null)
    setNewsPage(1)
  }

  // Merge base news + per-node newsCache, deduplicated by URL
  const allNews = useMemo(() => {
    const seen = new Set()
    const combined = [...news, ...Object.values(newsCache).flat()]
    return combined.filter((a) => {
      const key = a.arquivo_doc || a.original_url
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [news, newsCache])

  // Filter to articles where both entities appear in the current graph
  const visibleNodeIds = new Set(displayedNodes.map((n) => n.id))
  const visibleArticles = allNews.filter(
    (a) => visibleNodeIds.has(a.ent1_id) && visibleNodeIds.has(a.ent2_id)
  )

  // Filter by rel type matching the graph toggles (other always passes)
  const typeFilteredArticles = visibleArticles.filter((a) => {
    if (a.rel_type === 'supports') return showSupports
    if (a.rel_type === 'opposes') return showOpposes
    return true
  })

  const filteredArticles = selectedEdge
    ? typeFilteredArticles.filter((a) => {
        const pairMatch =
          (a.ent1_id === selectedEdge.from && a.ent2_id === selectedEdge.to) ||
          (a.ent1_id === selectedEdge.to && a.ent2_id === selectedEdge.from)
        if (!pairMatch) return false
        return selectedEdge.label === 'apoia' ? a.rel_type === 'supports' : a.rel_type === 'opposes'
      })
    : typeFilteredArticles
  const pagedArticles = filteredArticles.slice((newsPage - 1) * PAGE_SIZE, newsPage * PAGE_SIZE)

  return (
    <Box sx={{ paddingTop: 10 }}>

      {/* Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Preset: Governo / Assembleia */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5, textAlign: 'center' }}>
            {t('explore.preselect')}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>{t('filtered.government')}</InputLabel>
              <MuiSelect
                value={presetGoverno}
                label={t('filtered.government')}
                onChange={(e) => handlePresetSelect('government', e.target.value)}
              >
                <MenuItem value=""><em>{t('explore.presetNone')}</em></MenuItem>
                {GOVERNMENTS.map(([wikiId, name]) => (
                  <MenuItem key={wikiId} value={wikiId}>{localizeLabel(name, t)}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>{t('filtered.assembly')}</InputLabel>
              <MuiSelect
                value={presetAssembly}
                label={t('filtered.assembly')}
                onChange={(e) => handlePresetSelect('assembly', e.target.value)}
              >
                <MenuItem value=""><em>{t('explore.presetNone')}</em></MenuItem>
                {ASSEMBLIES.map(([wikiId, name]) => (
                  <MenuItem key={wikiId} value={wikiId}>{localizeLabel(name, t)}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            {presetLoading && <CircularProgress size={20} />}
          </Stack>
        </Box>

        {/* Personality select */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
            {t('explore.personalities')}
          </Typography>
          <Select
            isMulti
            value={selectedOption}
            onChange={setSelectedOption}
            options={personalities}
            placeholder={t('explore.selectPersonalities')}
          />
        </Box>

        {/* Year slider */}
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
            {t('explore.yearRange', { start: yearsValues[0], end: yearsValues[1] })}
          </Typography>
          <Slider
            value={yearsValues}
            onChange={(_, v) => setYearsValues(v)}
            valueLabelDisplay="auto"
            min={MIN_YEAR}
            max={MAX_YEAR}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleClick} disabled={loading}>
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            {t('explore.update')}
          </Button>
        </Box>
      </Paper>

      {isError && <Typography color="error" sx={{ mb: 2 }}>{t('explore.error')}</Typography>}

      {/* Graph */}
      {hasResults && displayedNodes.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>

          {/* Graph controls */}
          <GraphControls
            depth={depth} setDepth={setDepth}
            minNoticias={minNoticias} setMinNoticias={setMinNoticias}
            relTypeValue={relTypeValue} handleRelTypeChange={handleRelTypeChange}
            isExpandLoading={isExpandLoading}
            onReset={() => resetLayoutRef.current?.()}
          />

          <GraphCanvas
            nodes={displayedNodes}
            edges={displayedEdges}
            yearsValues={yearsValues}
            onEdgeClick={handleEdgeClick}
            onBackgroundClick={handleClearEdge}
            onFullscreen={() => setIsFullscreen(true)}
            fullscreen={false}
            resetRef={resetLayoutRef}
          />
          <Dialog
            fullScreen
            open={isFullscreen}
            onClose={() => setIsFullscreen(false)}
          >
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
              <GraphControls
                depth={depth} setDepth={setDepth}
                minNoticias={minNoticias} setMinNoticias={setMinNoticias}
                relTypeValue={relTypeValue} handleRelTypeChange={handleRelTypeChange}
                isExpandLoading={isExpandLoading}
                onReset={() => resetLayoutRef.current?.()}
              />
              <Box sx={{ position: 'relative', flex: 1 }}>
                <GraphCanvas
                  nodes={displayedNodes}
                  edges={displayedEdges}
                  yearsValues={yearsValues}
                  onEdgeClick={handleEdgeClick}
                  onBackgroundClick={handleClearEdge}
                  onFullscreen={() => setIsFullscreen(false)}
                  fullscreen={true}
                  resetRef={resetLayoutRef}
                />
              </Box>
            </Box>
          </Dialog>
        </Paper>
      )}

      {/* News */}
      {hasResults && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mb: 1 }}>
            {[
              { key: 'supports', label: 'Apoia',   color: COLOR_SUPPORTS },
              { key: 'opposes',  label: 'Opõe-se', color: COLOR_OPPOSES },
              { key: 'other',    label: 'Outro',   color: '#9e9e9e' },
            ].map(({ key, color }) => {
              const label = key === 'supports' ? t('explore.supports') : key === 'opposes' ? t('explore.opposes') : t('personality.other')
              const count = filteredArticles.filter((a) => a.rel_type === key).length
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

          {selectedEdge && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={`${selectedEdge.from} ${selectedEdge.label} ${selectedEdge.to}`}
                onDelete={handleClearEdge}
                color="primary"
                size="small"
              />
            </Box>
          )}

          {pagedArticles.length > 0
            ? <NewsTitles data={pagedArticles} />
            : <Typography variant="body2" color="text.secondary">{t('explore.noNews')}</Typography>
          }

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

    </Box>
  )
}

export default Explorar
