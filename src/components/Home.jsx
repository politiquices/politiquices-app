import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArticleIcon from '@mui/icons-material/Article'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import SearchIcon from '@mui/icons-material/Search'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { getStats, getPersons } from '../api'

function MetricCard({ icon, value, label }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        px: 1,
        borderRadius: 2,
        bgcolor: 'background.default',
        height: '100%',
      }}
    >
      {icon}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, mb: 0.5 }}>
        {value ?? '…'}
      </Typography>
      <Typography variant="caption" color="text.secondary" align="center">
        {label}
      </Typography>
    </Box>
  )
}

function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [persons, setPersons] = useState([])

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
    getPersons().then(setPersons).catch(() => {})
  }, [])

  const handleRandom = () => {
    if (!persons.length) return
    const random = persons[Math.floor(Math.random() * persons.length)]
    navigate(`/personalidade/${random.value}`)
  }

  return (
    <Box sx={{ paddingTop: 10 }}>

      {/* Hero */}
      <Paper elevation={2} sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Politiquices.PT
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          Pesquise relações de apoio ou oposição entre personalidades e partidos políticos
          expressas em títulos de notícias arquivadas pela web portuguesa.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/relacoes')}
          >
            Explorar Relações
          </Button>
          <Button
            variant="outlined"
            startIcon={<PeopleAltIcon />}
            onClick={() => navigate('/personalidades')}
          >
            Ver Personalidades
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShuffleIcon />}
            onClick={handleRandom}
            disabled={!persons.length}
          >
            Personalidade Aleatória
          </Button>
        </Stack>
      </Paper>

      {/* Stats */}
      {stats && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <MetricCard
                icon={<AccountBalanceIcon sx={{ fontSize: 36, color: 'primary.main' }} />}
                value={stats.nr_parties}
                label="Partidos Políticos"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricCard
                icon={<PeopleAltIcon sx={{ fontSize: 36, color: 'primary.main' }} />}
                value={stats.nr_persons}
                label="Personalidades"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricCard
                icon={<ArticleIcon sx={{ fontSize: 36, color: 'text.secondary' }} />}
                value={stats.nr_all_articles?.toLocaleString('pt-PT')}
                label="Artigos com personalidades"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricCard
                icon={<FactCheckIcon sx={{ fontSize: 36, color: '#44861E' }} />}
                value={stats.nr_all_articles_sentiment?.toLocaleString('pt-PT')}
                label="Artigos com apoio ou oposição"
              />
            </Grid>
          </Grid>
        </Paper>
      )}


    </Box>
  )
}

export default Home
