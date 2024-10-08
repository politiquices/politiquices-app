import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'

function Partido(parties) {
  const partidos = parties.data.map((party) => ({
    nr_members: party.nr_personalities,
    label: party.party_label,
    logo: party.party_logo,
    wiki_id: party.wiki_id,
  }))

  return partidos.map((entry) => (
    <Grid key="{index}" item width={150}>
      <Link>
        <CardActionArea>
          <Card sx={{ maxWidth: 180 }} className="card">
            <CardMedia
              style={{ width: 'auto' }}
              align="center"
              component="img"
              height="75"
              image={entry.logo}
              alt={entry.label}
            />
            <CardContent>
              <Typography gutterBottom variant="body2" color="text.secondary" align="center">
                {entry.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {entry.nr_members}
              </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </Link>
    </Grid>
  ))
}

function Partidos() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/parties/`)
      .then((response) => response.json())
      .then((parties) => {
        setData(parties)
      })
  }, [])

  if (data.length === 0) {
    return <div className="row">Nothing loaded</div>
  }
  return (
    <Grid container direction="row" spacing={2} columns={{ xs: 2, sm: 3, md: 4, lg: 8 }} justifyContent="space-evenly">
      {!data ? <p /> : <Partido data={data} />}
    </Grid>
  )
}

export default Partidos
