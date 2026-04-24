import { useMemo, useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import useVisNetwork from '../hooks/useVisNetwork.jsx'
import { useRelTypeToggle } from '../hooks/useRelTypeToggle'
import { getPersonalityTopRelated } from '../api'
import { MIN_YEAR, MAX_YEAR, COLOR_SUPPORTS, COLOR_OPPOSES, COLOR_SUPPORTS_BG, COLOR_OPPOSES_BG } from '../constants'
import { entityId } from '../utils'
import { useTranslation } from 'react-i18next'

// Returns the set of node IDs visible at the given depth from the cache.
// Used to determine which nodes still need to be fetched.
function getVisibleNodeIds(cache, mainId, topN, minFreq, showSupports, showOpposes, depth) {
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

      const byEnt = {}
      rels
        .filter((e) => e.freq >= minFreq)
        .forEach((e) => {
          const id = entityId(e.wiki_id)
          if (!byEnt[id] || e.freq > byEnt[id].freq) byEnt[id] = e
        })

      Object.values(byEnt)
        .sort((a, b) => b.freq - a.freq)
        .slice(0, topN)
        .forEach((e) => {
          const id = entityId(e.wiki_id)
          if (!visible.has(id)) { visible.add(id); next.push(id) }
        })
    }
    frontier = next
  }

  return visible
}

function buildGraphData(cache, mainId, mainName, mainImageUrl, topN, minFreq, showSupports, showOpposes, depth) {
  if (!cache[mainId]) return { nodes: [], edges: [] }

  const nodesMap = new Map()
  const edges = []
  let edgeId = 1

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

      const byEnt = {}
      rels
        .filter((e) => e.freq >= minFreq)
        .forEach((e) => {
          const id = entityId(e.wiki_id)
          if (!byEnt[id] || e.freq > byEnt[id].freq) byEnt[id] = e
        })

      Object.values(byEnt)
        .sort((a, b) => b.freq - a.freq)
        .slice(0, topN)
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

          edges.push({
            id: edgeId++,
            from: entry.from,
            to: entry.to,
            title: entry.relType,
            value: Math.log1p(entry.freq),
            color: entry.relType === 'apoia' ? COLOR_SUPPORTS : COLOR_OPPOSES,
          })
        })
    }

    frontier = next
  }

  return { nodes: Array.from(nodesMap.values()), edges }
}

function GraphCanvas({ nodes, edges, onEdgeClick, onBackgroundClick }) {
  const { container, nodePopover, edgePopover } = useVisNetwork({
    nodes,
    edges,
    Yearsvalues: [MIN_YEAR, MAX_YEAR],
    onEdgeClick,
    onBackgroundClick,
  })

  return (
    <>
      {nodePopover}
      {edgePopover}
      <Box
        ref={container}
        sx={{ width: '100%', height: 450, border: '1px solid #ccc', borderRadius: 1 }}
      />
    </>
  )
}

function PersonalidadeGraph({ topRelated, mainId, mainName, mainImageUrl, onEdgeClick, onBackgroundClick, onNodesChange, onGraphChange }) {
  const { t } = useTranslation()
  const [depth, setDepth] = useState(1)
  const [topN, setTopN] = useState(5)
  const [minFreq, setMinFreq] = useState(1)
  const { showSupports, setShowSupports, showOpposes, setShowOpposes, relTypeValue, handleRelTypeChange } = useRelTypeToggle()
  const [isLoading, setIsLoading] = useState(false)

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
  }, [mainId, topRelated])

  // Keep ref in sync with state so async loop always sees the latest cache
  useEffect(() => {
    dataCacheRef.current = dataCache
  }, [dataCache])

  // Fetch missing nodes when depth or mainId changes
  useEffect(() => {
    if (depth === 1) return

    let cancelled = false

    async function fetchMissing() {
      setIsLoading(true)

      // Run up to `depth` rounds so going 1→3 works in two passes
      for (let pass = 0; pass < depth && !cancelled; pass++) {
        const needed = getVisibleNodeIds(
          dataCacheRef.current, mainId, topN, minFreq, showSupports, showOpposes, depth
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
  }, [depth, mainId, minFreq, topN, showSupports, showOpposes])

  const { nodes, edges } = useMemo(
    () => buildGraphData(dataCache, mainId, mainName, mainImageUrl, topN, minFreq, showSupports, showOpposes, depth),
    [dataCache, mainId, mainName, mainImageUrl, topN, minFreq, showSupports, showOpposes, depth]
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

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      {/* Controls */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap" gap={1}>

          {/* Depth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>{t('graph.depth')}</Typography>
            <ToggleButtonGroup
              value={depth}
              exclusive
              onChange={(_, v) => { if (v !== null) setDepth(v) }}
              size="small"
            >
              {[1, 2, 3].map((d) => (
                <ToggleButton key={d} value={d} sx={{ px: 1.5, py: 0.5 }}>{d}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Top-N */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 160 }}>
            <Typography variant="caption" color="text.secondary" noWrap>{t('graph.topN', { n: topN })}</Typography>
            <Slider
              value={topN}
              min={3}
              max={10}
              step={1}
              onChange={(_, v) => setTopN(v)}
              size="small"
              sx={{ width: 100 }}
            />
          </Box>

          {/* Min. notícias */}
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

          {/* Tipo de relação */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>{t('graph.type')}</Typography>
            <ToggleButtonGroup
              value={relTypeValue}
              onChange={handleRelTypeChange}
              size="small"
            >
              <ToggleButton value="supports" sx={{ px: 1.5, py: 0.5, color: COLOR_SUPPORTS, '&.Mui-selected': { bgcolor: COLOR_SUPPORTS_BG, color: COLOR_SUPPORTS } }}>
                {t('graph.supports')}
              </ToggleButton>
              <ToggleButton value="opposes" sx={{ px: 1.5, py: 0.5, color: COLOR_OPPOSES, '&.Mui-selected': { bgcolor: COLOR_OPPOSES_BG, color: COLOR_OPPOSES } }}>
                {t('graph.opposes')}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {isLoading && <CircularProgress size={18} />}
        </Stack>

      </Stack>

      <Box sx={{ position: 'relative' }}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onEdgeClick={onEdgeClick}
          onBackgroundClick={onBackgroundClick}
        />
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
            <Typography variant="caption" color="text.secondary">{t('graph.supportsLegend')}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLOR_OPPOSES }} />
            <Typography variant="caption" color="text.secondary">{t('graph.opposesLegend')}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}

export default PersonalidadeGraph
