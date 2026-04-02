import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArticleIcon from '@mui/icons-material/Article'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import CircularIndeterminate from './utils/Circular'
import { getStats } from '../api'

const METRIC_CARDS = (data) => [
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    value: data.nr_parties,
    label: 'Partidos Políticos',
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    value: data.nr_persons,
    label: 'Personalidades',
  },
  {
    icon: <ArticleIcon sx={{ fontSize: 36, color: 'text.secondary' }} />,
    value: data.nr_all_articles?.toLocaleString('pt-PT'),
    label: 'Artigos com personalidades',
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: 36, color: '#44861E' }} />,
    value: data.nr_all_articles_sentiment?.toLocaleString('pt-PT'),
    label: 'Artigos com apoio ou oposição',
  },
]

function MetricCards({ data }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        {METRIC_CARDS(data).map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
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
              {card.icon}
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, mb: 0.5 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                {card.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

function ArticlesYearBar({ data }) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Artigos por Ano
      </Typography>
      <ResponsiveContainer width="100%" aspect={3}>
        <BarChart
          data={data.year_values}
          margin={{ top: 10, right: 30, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'ano', position: 'insideBottom', offset: -10 }} />
          <YAxis label={{ value: 'nº notícias', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="oposição" fill="#FF0000" />
          <Bar dataKey="apoio" fill="#44861E" />
        </BarChart>
      </ResponsiveContainer>
      <Typography align="center" color="text.secondary" sx={{ mt: 2, fontSize: 11 }}>
        Recolha feita com a API do Arquivo.PT a 2024-03-08
      </Typography>
    </Paper>
  )
}

function Stats() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    getStats()
      .then((stats) => {
        setIsLoading(false)
        setData(stats)
      })
      .catch(() => {
        setIsLoading(false)
        setIsError(true)
      })
  }, [])

  if (isError) return <div>Erro ao carregar dados.</div>
  if (isLoading || !data.year_values) return <CircularIndeterminate />

  return (
    <Box sx={{ paddingTop: 10 }}>
      <MetricCards data={data} />
      <ArticlesYearBar data={data} />
    </Box>
  )
}

export default Stats
