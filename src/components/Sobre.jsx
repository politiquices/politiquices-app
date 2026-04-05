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
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import StorageIcon from '@mui/icons-material/Storage'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GitHubIcon from '@mui/icons-material/GitHub'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArticleIcon from '@mui/icons-material/Article'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import CircularIndeterminate from './utils/Circular'
import { getStats } from '../api'
import { COLOR_SUPPORTS, COLOR_OPPOSES } from '../constants'


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
    icon: <FactCheckIcon sx={{ fontSize: 36, color: COLOR_SUPPORTS }} />,
    value: data.nr_all_articles_sentiment?.toLocaleString('pt-PT'),
    label: 'Artigos com apoio ou oposição',
  },
]

function Sobre() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    getStats()
      .then((data) => { setStats(data); setIsLoading(false) })
      .catch(() => { setIsLoading(false); setIsError(true) })
  }, [])

  return (
    <Box sx={{ paddingTop: 10 }}>

      {/* O que é */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          O que é Politiquices.PT?
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Politiquices.PT explora títulos de notícias arquivadas pela web portuguesa para descobrir
          quem apoia e quem se opõe a quem na política portuguesa.
        </Typography>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EmojiEventsIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              <Link href="https://www.publico.pt/2021/06/17/ciencia/noticia/arquivopt-premiada-plataforma-recolhe-dados-minorias-jornais-1966463" target="_blank">
                Prémio Arquivo.PT 2021
              </Link>
              {' '}— distinção pelo cruzamento de dados do Arquivo.PT com a Wikidata
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleOutlinedIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              <Link href="https://www.davidsbatista.net/assets/documents/publications/politiquices_dsbatista_20230705.pdf" target="_blank">
                Artigo científico
              </Link>
              {' '}publicado na revista Linguamática
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <OndemandVideoIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              <Link href="https://www.youtube.com/watch?v=lfNS_F84N6k" target="_blank">
                Vídeo de apresentação
              </Link>
              {' '}no âmbito dos seminários Café com Arquivo.PT 2022
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <GitHubIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              Código fonte disponível em{' '}
              <Link href="https://github.com/politiquices" target="_blank">
                github.com/politiquices
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <StorageIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              Endpoint SPARQL:{' '}
              <Link href="http://sparql.politiquices.pt" target="_blank">
                sparql.politiquices.pt
              </Link>
              {' — '}
              <Link href="https://github.com/politiquices/SPARQL-endpoint/blob/main/tutorials/sparql_queries.md" target="_blank">
                exemplos de queries
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Os dados em números */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {isLoading && <CircularIndeterminate />}
        {isError && <Typography color="error">Erro ao carregar estatísticas.</Typography>}
        {stats && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {METRIC_CARDS(stats).map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 1,
                      px: 1,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      height: '100%',
                    }}
                  >
                    {card.icon}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5, mb: 0.25 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      {card.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <ResponsiveContainer width="100%" aspect={3}>
              <BarChart
                data={stats.year_values}
                margin={{ top: 10, right: 30, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'ano', position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: 'nº notícias', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="oposição" fill={COLOR_OPPOSES} />
                <Bar dataKey="apoio" fill={COLOR_SUPPORTS} />
              </BarChart>
            </ResponsiveContainer>
            <Typography align="center" color="text.secondary" sx={{ mt: 2, fontSize: 11 }}>
              Recolha feita com a API do Arquivo.PT a 2024-03-08
            </Typography>
          </>
        )}
      </Paper>

    </Box>
  )
}

export default Sobre
