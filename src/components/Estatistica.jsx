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
import CircularIndeterminate from './utils/Circular'
import { getStats } from '../api'

function ArticlesYearBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data.year_values}
        margin={{ top: 50, right: 150, bottom: 50, left: 150 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" label={{ value: 'ano', position: 'insideBottom', offset: -10 }} />
        <YAxis label={{ value: 'número notícias', angle: -90, position: 'insideLeft', offset: 10 }} />
        <Tooltip />
        <Legend verticalAlign="top" />
        <Bar dataKey="oposição" fill="red" />
        <Bar dataKey="apoio" fill="green" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function GeneralStats({ data }) {
  return (
    <>
      <Typography align="center" gutterBottom variant="h6" component="h1" sx={{ paddingTop: 10 }}>
        {data.nr_parties} Partidos Políticos
      </Typography>
      <Typography align="center" gutterBottom variant="h6" component="h1">
        {data.nr_persons} Personalidades
      </Typography>
      <Typography align="center" gutterBottom variant="h6" component="h1">
        {data.nr_all_articles} artigos referindo personalidades
      </Typography>
      <Typography align="center" gutterBottom variant="h6" component="h1">
        {data.nr_all_articles_sentiment} artigos referindo personalidades c/ sentimento de apoio ou oposição
      </Typography>
    </>
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
    <>
      <GeneralStats data={data} />
      <ArticlesYearBar data={data} />
      <Typography align="center" color="text.secondary" sx={{ paddingTop: 2, fontSize: 11 }}>
        Recolha feita com a API do Arquivo.PT a 2024-03-08
      </Typography>
    </>
  )
}

export default Stats
