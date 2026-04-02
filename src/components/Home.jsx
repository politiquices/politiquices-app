import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArticleIcon from '@mui/icons-material/Article'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import HubIcon from '@mui/icons-material/Hub'
import SearchIcon from '@mui/icons-material/Search'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import StorageIcon from '@mui/icons-material/Storage'
import { getStats, getPersons } from '../api'

const HOW_IT_WORKS = [
  {
    icon: <NewspaperIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Notícias Arquivadas',
    desc: 'Os dados provêm do Arquivo.PT, que preserva títulos de notícias da web portuguesa desde os anos 90.',
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: 36, color: '#44861E' }} />,
    title: 'Apoio e Oposição',
    desc: 'Relações de apoio ou oposição entre personalidades são extraídas automaticamente dos títulos das notícias.',
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Personalidades',
    desc: 'Cada personalidade política está ligada à Wikidata, o que permite enriquecer os dados com informação biográfica.',
  },
  {
    icon: <HubIcon sx={{ fontSize: 36, color: 'text.secondary' }} />,
    title: 'Rede de Relações',
    desc: 'Explore a rede de interações entre vários atores políticos através de grafos interativos.',
  },
]

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

      {/* How it works */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Como funciona
        </Typography>
        <Grid container spacing={2}>
          {HOW_IT_WORKS.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Stack alignItems="center" spacing={1} sx={{ textAlign: 'center', py: 1 }}>
                {item.icon}
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.desc}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quick access */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <StorageIcon color="primary" fontSize="small" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Acesso Técnico
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Os dados estão disponíveis através de um endpoint SPARQL público em{' '}
          <Link href="http://sparql.politiquices.pt" target="_blank">
            sparql.politiquices.pt
          </Link>
          . Consulte os{' '}
          <Link href="https://github.com/politiquices/SPARQL-endpoint/blob/main/tutorials/sparql_queries.md" target="_blank">
            exemplos de queries
          </Link>
          {' '}para começar a explorar os dados diretamente.
        </Typography>
      </Paper>

    </Box>
  )
}

export default Home
