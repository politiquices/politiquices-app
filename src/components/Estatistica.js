/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import CircularIndeterminate from './utils/Circular'

const chartData = [
  {
    year: '1994',
    oposição: 168,
    apoio: 23,
  },
  {
    year: '1995',
    oposição: 16,
    apoio: 13,
  },
  {
    year: '1996',
    oposição: 2168,
    apoio: 223,
  },
  {
    year: '1997',
    oposição: 268,
    apoio: 2,
  },
  {
    year: '1998',
    oposição: 1128,
    apoio: 3,
  },
  {
    year: '1999',
    oposição: 1168,
    apoio: 232,
  },
  {
    year: '2000',
    oposição: 2268,
    apoio: 5523,
  },
]

function MyResponsiveBar(data) {
  console.log('inside:')
  console.log(data)
  console.log(data.data.year_values)
  return (
    <ResponsiveBar
      data={data.data.year_values}
      keys={['opposes', 'supports']}
      indexBy="year"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
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
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={function (e) {
        return e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
      }}
    />
  )
}

function Stats() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch('http://127.0.0.1:8000/stats/')
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
    <div style={{ height: 500 }}>
      <MyResponsiveBar data={data} />
    </div>
  )
}

export default Stats
