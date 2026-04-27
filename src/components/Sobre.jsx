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
import MuiTooltip from '@mui/material/Tooltip'
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
import { useTranslation } from 'react-i18next'

function Sobre() {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const METRIC_CARDS = (data) => [
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
      value: data.nr_parties,
      label: t('about.parties'),
    },
    {
      icon: <PeopleAltIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
      value: data.nr_persons,
      label: t('about.personalities'),
    },
    {
      icon: <ArticleIcon sx={{ fontSize: 36, color: 'text.secondary' }} />,
      value: data.nr_all_articles?.toLocaleString(i18n.language === 'pt' ? 'pt-PT' : 'en-GB'),
      label: t('about.articlesWithPersonalities'),
    },
    {
      icon: <FactCheckIcon sx={{ fontSize: 36, color: COLOR_SUPPORTS }} />,
      value: data.nr_all_articles_sentiment?.toLocaleString(i18n.language === 'pt' ? 'pt-PT' : 'en-GB'),
      label: t('about.articlesWithSentiment'),
    },
  ]

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
          {t('about.title')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('about.description')}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={9} justifyContent="center" sx={{ mt: 2 }}>
          {[
            { href: 'https://www.publico.pt/2021/06/17/ciencia/noticia/arquivopt-premiada-plataforma-recolhe-dados-minorias-jornais-1966463', icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />, label: t('about.award'), tooltip: t('about.awardDesc') },
            { href: 'https://www.davidsbatista.net/assets/documents/publications/politiquices_dsbatista_20230705.pdf', icon: <ArticleOutlinedIcon sx={{ fontSize: 32 }} />, label: t('about.paper'), tooltip: t('about.paperDesc') },
            { href: 'https://www.youtube.com/watch?v=lfNS_F84N6k', icon: <OndemandVideoIcon sx={{ fontSize: 32 }} />, label: t('about.video'), tooltip: t('about.videoDesc') },
            { href: 'https://github.com/politiquices', icon: <GitHubIcon sx={{ fontSize: 32 }} />, label: 'GitHub' },
            { href: 'http://sparql.politiquices.pt', icon: <StorageIcon sx={{ fontSize: 32 }} />, label: 'SPARQL' },
            { href: 'https://github.com/politiquices/SPARQL-endpoint/blob/main/tutorials/sparql_queries.md', icon: <ArticleOutlinedIcon sx={{ fontSize: 32 }} />, label: t('about.sparqlExamples') },
          ].map(({ href, icon, label, tooltip }) => (
            <MuiTooltip key={label} title={tooltip ?? ''} arrow>
              <Link href={href} target="_blank" underline="none" color="inherit">
                <Stack alignItems="center" spacing={0.5} sx={{ width: 90, '&:hover': { color: 'primary.main' } }}>
                  {icon}
                  <Typography variant="caption" align="center" sx={{ lineHeight: 1.3 }}>{label}</Typography>
                </Stack>
              </Link>
            </MuiTooltip>
          ))}
        </Stack>
      </Paper>

      {/* Os dados em números */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {isLoading && <CircularIndeterminate />}
        {isError && <Typography color="error">{t('about.statsError')}</Typography>}
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
                data={stats.year_values.map((d) => ({ year: d.year, opposes: d['oposição'], supports: d['apoio'] }))}
                margin={{ top: 10, right: 30, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: t('about.chartYear'), position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: t('about.chartNews'), angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="opposes" name={t('about.chartOpposes')} fill={COLOR_OPPOSES} />
                <Bar dataKey="supports" name={t('about.chartSupports')} fill={COLOR_SUPPORTS} />
              </BarChart>
            </ResponsiveContainer>
            <Typography align="center" color="text.secondary" sx={{ mt: 2, fontSize: 11 }}>
              {t('about.dataCollection')}
            </Typography>
          </>
        )}
      </Paper>

    </Box>
  )
}

export default Sobre
