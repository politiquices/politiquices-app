/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import Typography from '@mui/material/Typography'
import CircularIndeterminate from './utils/Circular'

function ArticlesYearBar(data) {
  return (
    <ResponsiveBar
      data={data.data.year_values}
      keys={['oposição', 'apoio']}
      indexBy="year"
      margin={{ top: 50, right: 150, bottom: 50, left: 150 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      // Custom colors for each key
      colors={['red', 'green']} // Colors for 'oposição' and 'apoio'
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'ano',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'número notícias',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      // Add theme to customize label styles
      // theme={{
      //  labels: {
      //    text: {
      //      fontWeight: 'bold', // Make the labels bold
      //      fontSize: 14,       // Increase font size if needed
      //    },
      //  },
      // }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
    />
  )
}

function PersonalityArticlesYearBar(data) {
  
  const reversed = data.data.personality_freq.reverse()
  
  return (
    <ResponsiveBar
      data={reversed}
      keys={['freq']}
      indexBy="person"
      margin={{ top: 0, right: 250, bottom: 0, left: 300 }}
      padding={0.1}
      layout="horizontal"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'green',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'número notícias',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 1,
        tickPadding: 10,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: -140,
      }}
      labelSkipWidth={1}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      legends={[]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={function (e) {
        return e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
      }}
    />
  )
}

function GeneralStats(data) {
  return (
    <>
      <Typography align="center" gutterBottom variant="h6" component="h1" sx={{ paddingTop: 10 }}>
        {data.data.nr_parties} Partidos Políticos
      </Typography>
      <Typography align="center" gutterBottom variant="h6" component="h1">
        {data.data.nr_persons} Personalidades
      </Typography>
      <Typography align="center" gutterBottom variant="h6" component="h1">
        {data.data.nr_all_articles} artigos referindo personalidades
      </Typography>
      <Typography align="center" gutterBottom variant="h6" component="h1">
        {data.data.nr_all_articles_sentiment} artigos referindo personalidades c/ sentimento de apoio ou oposição
      </Typography>
    </>
  )
}

function Stats() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/stats`)
      .then((response) => response.json())
      .then((stats) => {
        setIsLoading(false)
        setData(stats)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(true)
        console.log(error)
      })
  }
  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading || !data.year_values) {
    return <CircularIndeterminate />
  }
  return (
    <>
      <GeneralStats data={data} />
      <div style={{ height: 500 }}>
        <ArticlesYearBar data={data} />
      </div>
      <Typography align="center" color="text.secondary" sx={{ paddingTop: 2, fontSize: 11 }}>
        Recolha feita com a API do Arquivo.PT a 2024-03-08
      </Typography>
      {/* 
      <div style={{ height: 5500 }}>
        <PersonalityArticlesYearBar data={data} />
      </div>
    */}
    </>
  )
}

export default Stats
