/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import CircularIndeterminate from './utils/Circular'

function Stats() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch('http://127.0.0.1:8000/stats/')
      .then((response) => response.json())
      .then((stats) => {
        setIsLoading(false)
        console.log(stats)
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

  if (isLoading || !data) {
    return <CircularIndeterminate />
  }
  return <Alert>Sobre</Alert>
}

export default Stats
