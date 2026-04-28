import { useMemo, useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import useVisNetwork from '../hooks/useVisNetwork.jsx'
import { useRelTypeToggle } from '../hooks/useRelTypeToggle'
import { getPersonalityTopRelated } from '../api'
import { MIN_YEAR, MAX_YEAR, COLOR_SUPPORTS, COLOR_OPPOSES, COLOR_SUPPORTS_BG, COLOR_OPPOSES_BG } from '../constants'
import { entityId } from '../utils'
import { useTranslation } from 'react-i18next'

// Returns the set of node IDs visible at the given depth from the cache.
const MAX_INITIAL_NODES = 10

function computeDynamicMinFreq(data) {
  if (!data) return 1
  const allRels = [
    ...(data.who_supports_person ?? []),
    ...(data.who_person_supports ?? []),
    ...(data.who_opposes_person ?? []),
    ...(data.who_person_opposes ?? []),
  ]
  const byEnt = {}
  allRels.forEach((e) => {
    const id = entityId(e.wiki_id)
    if (!byEnt[id] || e.freq > byEnt[id]) byEnt[id] = e.freq
  })
  const freqs = Object.values(byEnt).sort((a, b) => b - a)
  if (freqs.length <= MAX_INITIAL_NODES) return 1
  return freqs[MAX_INITIAL_NODES - 1]
}

// Used to determine which nodes still need to be fetched.
function getVisibleNodeIds(cache, mainId, minFreq, showSupports, showOpposes, depth) {
  const visible = new Set([mainId])
  let frontier = [mainId]

  for (let level = 0; level < depth; level++) {
    const next = []
    for (const nodeId of frontier) {
      const data = cache[nodeId]
      if (!data || !data.who_opposes_person) continue

      const rels = []
      if (showSupports) {
        data.who_supports_person.forEach((e) => rels.push(e))
        data.who_person_supports.forEach((e) => rels.push(e))
      }
      if (showOpposes) {
        data.who_opposes_person.forEach((e) => rels.push(e))
        data.who_person_opposes.forEach((e) => rels.push(e))
      }

      rels
        .filter((e) => e.freq >= minFreq)
        .forEach((e) => {
          const id = entityId(e.wiki_id)
          if (!visible.has(id)) { visible.add(id); next.push(id) }
        })
    }
    frontier = next
  }

  return visible
}

function buildGraphData(cache, mainId, mainName, mainImageUrl, minFreq, showSupports, showOpposes, depth) {
  if (!cache[mainId]) return { nodes: [], edges: [] }

  const nodesMap = new Map()
  const edgeSet = new Set()
  const edges = []
  let edgeId = 1

  function pushEdge(from, to, relType, freq) {
    const key = `${from}:${to}:${relType}`
    if (edgeSet.has(key)) return
    edgeSet.add(key)
    edges.push({
      id: edgeId++,
      from,
      to,
      title: relType,
      value: Math.log1p(freq),
      color: relType === 'apoia' ? COLOR_SUPPORTS : COLOR_OPPOSES,
    })
  }

  nodesMap.set(mainId, {
    id: mainId,
    label: mainName,
    shape: 'circularImage',
    image: mainImageUrl,
    size: 45,
    borderWidth: 3,
    color: { border: '#1976d2' },
  })

  let frontier = [mainId]

  for (let level = 0; level < depth; level++) {
    const next = []

    for (const nodeId of frontier) {
      const data = cache[nodeId]
      if (!data || !data.who_opposes_person) continue

      const rels = []
      if (showSupports) {
        data.who_supports_person.forEach((e) =>
          rels.push({ ...e, from: entityId(e.wiki_id), to: nodeId, relType: 'apoia' })
        )
        data.who_person_supports.forEach((e) =>
          rels.push({ ...e, from: nodeId, to: entityId(e.wiki_id), relType: 'apoia' })
        )
      }
      if (showOpposes) {
        data.who_opposes_person.forEach((e) =>
          rels.push({ ...e, from: entityId(e.wiki_id), to: nodeId, relType: 'opõe-se' })
        )
        data.who_person_opposes.forEach((e) =>
          rels.push({ ...e, from: nodeId, to: entityId(e.wiki_id), relType: 'opõe-se' })
        )
      }

      rels
        .filter((e) => e.freq >= minFreq)
        .forEach((entry) => {
          const entId = entityId(entry.wiki_id)
          if (!nodesMap.has(entId)) {
            nodesMap.set(entId, {
              id: entId,
              label: entry.name,
              shape: 'circularImage',
              image: entry.image_url,
              size: Math.max(20, 35 - level * 5),
            })
            next.push(entId)
          }
          pushEdge(entry.from, entry.to, entry.relType, entry.freq)
        })
    }

    frontier = next
  }

  // Cross-edges: for cached nodes already visible, draw edges between them
  for (const [nodeId, data] of Object.entries(cache)) {
    if (!nodesMap.has(nodeId) || !data || !data.who_opposes_person) continue

    const crossRels = []
    if (showSupports) {
      data.who_supports_person.forEach((e) =>
        crossRels.push({ from: entityId(e.wiki_id), to: nodeId, relType: 'apoia', freq: e.freq })
      )
      data.who_person_supports.forEach((e) =>
        crossRels.push({ from: nodeId, to: entityId(e.wiki_id), relType: 'apoia', freq: e.freq })
      )
    }
    if (showOpposes) {
      data.who_opposes_person.forEach((e) =>
        crossRels.push({ from: entityId(e.wiki_id), to: nodeId, relType: 'opõe-se', freq: e.freq })
      )
      data.who_person_opposes.forEach((e) =>
        crossRels.push({ from: nodeId, to: entityId(e.wiki_id), relType: 'opõe-se', freq: e.freq })
      )
    }

    crossRels
      .filter((r) => r.freq >= minFreq && r.from !== r.to && nodesMap.has(r.from) && nodesMap.has(r.to))
      .forEach((r) => pushEdge(r.from, r.to, r.relType, r.freq))
  }

  return { nodes: Array.from(nodesMap.values()), edges }
}

function GraphCanvas({ nodes, edges, onEdgeClick, onBackgroundClick, onFullscreen, fullscreen, resetRef, isLoading }) {
  const { t } = useTranslation()
  const { container, nodePopover, edgePopover, resetLayout } = useVisNetwork({
    nodes,
    edges,
    Yearsvalues: [MIN_YEAR, MAX_YEAR],
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
          sx={{ width: '100%', height: fullscreen ? '100%' : 450, border: '1px solid #ccc', borderRadius: 1 }}
        />
        {isLoading && (
          <Box sx={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 1,
          }}>
            <CircularProgress />
          </Box>
        )}
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
            position: 'absolute', bottom: 8, right: 8,
            bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 1,
            px: 1, py: 0.5, pointerEvents: 'none',
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLOR_SUPPORTS }} />
            <Typography variant="caption" color="text.secondary">{t('graph.supportsLegend')}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLOR_OPPOSES }} />
            <Typography variant="caption" color="text.secondary">{t('graph.opposesLegend')}</Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

function GraphControls({ depth, setDepth, minFreq, setMinFreq, relTypeValue, handleRelTypeChange, isLoading, onReset }) {
  const { t } = useTranslation()
  return (
    <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{t('graph.depth')}</Typography>
        <ToggleButtonGroup value={depth} exclusive onChange={(_, v) => { if (v !== null) setDepth(v) }} size="small">
          {[1, 2, 3].map((d) => (
            <ToggleButton key={d} value={d} sx={{ px: 1.5, py: 0.5 }}>{d}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{t('graph.minNews')}</Typography>
        <TextField
          type="number"
          value={minFreq}
          onChange={(e) => setMinFreq(Math.max(1, parseInt(e.target.value) || 1))}
          size="small"
          inputProps={{ min: 1, style: { width: 48, padding: '4px 8px' } }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{t('graph.type')}</Typography>
        <ToggleButtonGroup value={relTypeValue} onChange={handleRelTypeChange} size="small">
          <ToggleButton value="supports" sx={{ px: 1.5, py: 0.5, color: COLOR_SUPPORTS, '&.Mui-selected': { bgcolor: COLOR_SUPPORTS_BG, color: COLOR_SUPPORTS } }}>
            {t('graph.supports')}
          </ToggleButton>
          <ToggleButton value="opposes" sx={{ px: 1.5, py: 0.5, color: COLOR_OPPOSES, '&.Mui-selected': { bgcolor: COLOR_OPPOSES_BG, color: COLOR_OPPOSES } }}>
            {t('graph.opposes')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {isLoading && <CircularProgress size={18} />}
      {onReset && (
        <ToggleButton size="small" value="" onClick={onReset} sx={{ px: 1.5, py: 0.5, textTransform: 'none' }}>
          {t('explore.resetLayout')}
        </ToggleButton>
      )}
    </Stack>
  )
}

function PersonalidadeGraph({ topRelated, mainId, mainName, mainImageUrl, onEdgeClick, onBackgroundClick, onNodesChange, onGraphChange }) {
  const { t } = useTranslation()
  const [depth, setDepth] = useState(1)
  const [minFreq, setMinFreq] = useState(() => computeDynamicMinFreq(topRelated))
  const { showSupports, setShowSupports, showOpposes, setShowOpposes, relTypeValue, handleRelTypeChange } = useRelTypeToggle()
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const resetLayoutRef = useRef(null)

  // Seed cache with main node's data on mount / personality change
  const [dataCache, setDataCache] = useState(() =>
    topRelated ? { [mainId]: topRelated } : {}
  )
  const dataCacheRef = useRef(dataCache)

  useEffect(() => {
    const initial = topRelated ? { [mainId]: topRelated } : {}
    setDataCache(initial)
    dataCacheRef.current = initial
    setDepth(1)
    setMinFreq(computeDynamicMinFreq(topRelated))
  }, [mainId, topRelated])

  // Keep ref in sync with state so async loop always sees the latest cache
  useEffect(() => {
    dataCacheRef.current = dataCache
  }, [dataCache])

  // Fetch missing nodes when depth or mainId changes
  useEffect(() => {
    let cancelled = false

    async function fetchMissing() {
      setIsLoading(true)

      // Run up to `depth` rounds so going 1→3 works in two passes
      for (let pass = 0; pass < depth && !cancelled; pass++) {
        const needed = getVisibleNodeIds(
          dataCacheRef.current, mainId, minFreq, showSupports, showOpposes, depth
        )
        const missing = [...needed].filter((id) => !dataCacheRef.current[id])
        if (missing.length === 0) break

        const results = await Promise.all(
          missing.map((id) =>
            getPersonalityTopRelated(id)
              .then((data) => ({ id, data }))
              .catch(() => ({ id, data: null }))
          )
        )

        if (cancelled) break

        const newEntries = {}
        results.forEach(({ id, data }) => { if (data) newEntries[id] = data })

        // Update ref immediately so the next pass sees the new data
        Object.assign(dataCacheRef.current, newEntries)
        setDataCache((prev) => ({ ...prev, ...newEntries }))
        if (onNodesChange) onNodesChange(Object.keys(newEntries))
      }

      if (!cancelled) setIsLoading(false)
    }

    fetchMissing()
    return () => { cancelled = true }
  }, [depth, mainId, minFreq, showSupports, showOpposes])

  const { nodes, edges } = useMemo(
    () => buildGraphData(dataCache, mainId, mainName, mainImageUrl, minFreq, showSupports, showOpposes, depth),
    [dataCache, mainId, mainName, mainImageUrl, minFreq, showSupports, showOpposes, depth]
  )

  useEffect(() => {
    if (onGraphChange) {
      onGraphChange({
        visibleNodeIds: new Set(nodes.map((n) => n.id)),
        showSupports,
        showOpposes,
      })
    }
  }, [nodes, showSupports, showOpposes])

  if (!nodes.length) return null

  const controlProps = { depth, setDepth, minFreq, setMinFreq, relTypeValue, handleRelTypeChange, isLoading, onReset: () => resetLayoutRef.current?.() }
  const canvasProps = { nodes, edges, onEdgeClick, onBackgroundClick, isLoading, resetRef: resetLayoutRef }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <GraphControls {...controlProps} />
      <Box sx={{ position: 'relative' }}>
        <GraphCanvas {...canvasProps} onFullscreen={() => setIsFullscreen(true)} fullscreen={false} />
      </Box>

      <Dialog fullScreen open={isFullscreen} onClose={() => setIsFullscreen(false)}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
          <GraphControls {...controlProps} />
          <Box sx={{ position: 'relative', flex: 1 }}>
            <GraphCanvas {...canvasProps} onFullscreen={() => setIsFullscreen(false)} fullscreen={true} />
          </Box>
        </Box>
      </Dialog>
    </Paper>
  )
}

export default PersonalidadeGraph
