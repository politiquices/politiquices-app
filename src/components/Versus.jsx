import { useState, useEffect } from 'react'
import Select from 'react-select'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import NewsTitles from './utils/NewsTitles'
import { MIN_YEAR, MAX_YEAR } from '../constants'
import { getPersonsAndParties, getQueries } from '../api'

const PAGE_SIZE = 10

const RELATIONS = [
  { label: 'apoia',               value: 'ent1_supports_ent2' },
  { label: 'opõe-se',             value: 'ent1_opposes_ent2' },
  { label: 'todas c/ sentimento', value: 'all_sentiment' },
  { label: 'todas',               value: 'all' },
]

function EntityAvatar({ option }) {
  if (!option) return null
  return (
    <Stack alignItems="center" spacing={0.5}>
      <Avatar
        src={`/assets/images/personalities_small/${option.value}.jpg`}
        alt={option.label}
        sx={{ width: 64, height: 64 }}
      />
      <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 120 }}>
        {option.label}
      </Typography>
    </Stack>
  )
}

function Versus() {
  const [personalities, setPersonalities] = useState([])
  const [ent1, setEnt1] = useState(null)
  const [ent2, setEnt2] = useState(null)
  const [relType, setRelType] = useState(null)
  const [yearsValues, setYearsValues] = useState([2000, MAX_YEAR])

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [isError, setIsError] = useState(false)
  const [newsPage, setNewsPage] = useState(1)

  useEffect(() => {
    getPersonsAndParties().then(setPersonalities).catch(() => setIsError(true))
  }, [])

  const canSubmit = ent1 && ent2 && relType && !loading

  const handleClick = () => {
    if (!canSubmit) return
    const [min, max] = yearsValues
    setLoading(true)
    setNewsPage(1)
    getQueries({ ent1: ent1.value, ent2: ent2.value, relType: relType.value, start: min, end: max })
      .then((data) => {
        setArticles(data ?? [])
        setHasResults(true)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setIsError(true)
      })
  }

  const pagedArticles = articles.slice((newsPage - 1) * PAGE_SIZE, newsPage * PAGE_SIZE)

  return (
    <Box sx={{ paddingTop: 10 }}>

      {/* Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Three selects in a row */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Select
              value={ent1}
              onChange={setEnt1}
              options={personalities}
              placeholder="Personalidade ou partido..."
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Select
              value={relType}
              onChange={setRelType}
              options={RELATIONS}
              placeholder="Tipo de relação..."
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Select
              value={ent2}
              onChange={setEnt2}
              options={personalities}
              placeholder="Personalidade ou partido..."
            />
          </Grid>
        </Grid>

        {/* Year slider */}
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
            Intervalo de Anos: {yearsValues[0]} – {yearsValues[1]}
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
          <Button variant="contained" onClick={handleClick} disabled={!canSubmit}>
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Actualizar
          </Button>
        </Box>
      </Paper>

      {isError && <Typography color="error" sx={{ mb: 2 }}>Erro ao carregar dados.</Typography>}

      {/* Results */}
      {hasResults && (
        <Paper elevation={2} sx={{ p: 2 }}>

          {/* Entity avatars + rel type summary */}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <EntityAvatar option={ent1} />
            <Chip
              label={relType?.label}
              size="small"
              sx={{
                bgcolor: relType?.value === 'ent1_supports_ent2' ? '#e8f5e9' : relType?.value === 'ent1_opposes_ent2' ? '#ffebee' : undefined,
                color: relType?.value === 'ent1_supports_ent2' ? '#44861E' : relType?.value === 'ent1_opposes_ent2' ? '#c62828' : undefined,
                fontWeight: 'bold',
              }}
            />
            <EntityAvatar option={ent2} />
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Notícias {articles.length > 0 && `(${articles.length})`}
          </Typography>

          {articles.length === 0
            ? <Typography variant="body2" color="text.secondary">Nenhuma notícia encontrada.</Typography>
            : <NewsTitles data={pagedArticles} />
          }

          {articles.length > PAGE_SIZE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <Pagination
                count={Math.ceil(articles.length / PAGE_SIZE)}
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

export default Versus
