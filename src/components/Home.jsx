import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import CasinoIcon from '@mui/icons-material/Casino'
import { getPersons } from '../api'

const CARDS = [
  {
    icon: <AccountTreeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Explorar Relações',
    description: 'Selecciona personalidades e visualiza quem apoia e quem se opõe a quem num grafo interactivo.',
    action: '/relacoes',
    label: 'Explorar',
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Personalidades',
    description: 'Navega pelo catálogo de figuras políticas e descobre as suas relações.',
    action: '/personalidades',
    label: 'Ver Personalidades',
  },
  {
    icon: <CompareArrowsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Versus',
    description: 'Compara directamente duas personalidades ou partidos e as relações entre eles.',
    action: '/versus',
    label: 'Comparar',
  },
]

function Home() {
  const navigate = useNavigate()
  const [persons, setPersons] = useState([])

  useEffect(() => {
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
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', mb: 3 }}>
          Explora títulos de notícias arquivadas pela web portuguesa para descobrir
          quem apoia e quem se opõe a quem na política portuguesa.
        </Typography>
        <Link
          component="button"
          variant="body1"
          color="text.secondary"
          onClick={handleRandom}
          disabled={!persons.length}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
        >
          <CasinoIcon fontSize="small" />
          Personalidade aleatória
        </Link>
      </Paper>

      {/* Feature cards */}
      <Grid container spacing={3}>
        {CARDS.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {card.icon}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1.5, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {card.description}
              </Typography>
              <Button variant="contained" size="small" onClick={() => navigate(card.action)}>
                {card.label}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

    </Box>
  )
}

export default Home
