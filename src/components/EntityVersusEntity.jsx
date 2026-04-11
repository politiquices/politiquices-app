import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'
import { getRelationships } from '../api'

function EntityVersusEntity() {
  const { t } = useTranslation()
  const { ent1, ent2, relType, start, end} = useParams()
  const [headlines, setData] = useState(null)
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

  if (isLoading) return <CircularIndeterminate />
  if (isError) return <Typography color="error">{t('common.error')}</Typography>

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
      <NewsTitles data={headlines} />
    </Grid>
  )
}

export default EntityVersusEntity
