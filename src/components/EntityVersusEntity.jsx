import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useParams } from 'react-router-dom'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'
import { getRelationships } from '../api'

function EntityVersusEntity() {
  const { ent1, ent2, relType, start, end} = useParams()
  const [headlines, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchData = () => {

    setIsLoading(true)
    getRelationships(ent1, relType, ent2, start, end)
      .then((data) => {
        setIsLoading(false)
        setData(data)
      })
      .catch(() => {
        setIsLoading(false)
        setIsError(true)
      })
  }
  useEffect(() => {
    fetchData()
  }, [ent1, ent2, relType, start, end])

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
      {isError && <Typography color="error">Erro ao carregar dados.</Typography>}
    </Grid>
  )
}

export default EntityVersusEntity
