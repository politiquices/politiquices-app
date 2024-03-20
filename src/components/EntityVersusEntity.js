import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { useParams } from 'react-router-dom'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'

function EntityVersusEntity() {
  const { ent1, ent2, relType } = useParams()
  const [headlines, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/relationships/${ent1}/${relType}/${ent2}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setData(data)
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

  if (isLoading || !headlines) {
    return <CircularIndeterminate />
  }
  
  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
      sx={{ paddingTop: 10 }}
    >
      {headlines && <NewsTitles data={headlines} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default EntityVersusEntity
