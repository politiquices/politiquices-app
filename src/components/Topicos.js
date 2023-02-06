import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Plot from 'react-plotly.js'

function ShowTopic({ data }) {
  console.log(data)
  if (data.figure) {
    // console.log(data)
    console.log(data.figure.layout)
    console.log(data.figure.data)
    return <Plot data={data.figure.data} layout={data.figure.layout} />
  }
  return null
}

function Topicos() {
  const { url } = useParams()
  const [topicData, setData] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [isError, setIsError] = useState(false)

  console.log(url)

  const fetchData = () => {
    fetch(`http://127.0.0.1:8000/topics/${url}`)
      .then((response) => response.json())
      .then((data) => {
        // setIsLoading(false)
        setData(data)
        console.log(data)
      })
      .catch((error) => {
        // setIsLoading(false)
        // setIsError(true)
        console.log(error)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log(topicData)

  if (topicData) {
    return <div>{topicData && <ShowTopic data={topicData} />}</div>
  }
  return (
    <Typography align="center" sx={{ paddingTop: 10 }}>
      Explorar artigos por topicos
    </Typography>
  )
}

export default Topicos
