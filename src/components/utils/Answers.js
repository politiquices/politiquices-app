/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
// import CardHeader from 'react-bootstrap/esm/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Link from '@material-ui/core/Link'
import Box from '@mui/material/Box'
import ShareIcon from '@mui/icons-material/Share'
import IconButton from '@mui/material/IconButton'

// const PublicoLogo = '/assets/images/logos/publico_logo.png'
const ArquivoLogo = '/assets/images/logos/arquivo_logo.png'

function Answers(data) {
  if (!data.data.answers) {
    return null
  }

  const answers = data.data.answers.map((RawData) => ({
    answer: RawData.answer,
    context: RawData.context,
    url: RawData.meta.url,
    date: RawData.meta.date,
  }))

  const answersRendered = answers.map((entry, index) => (
    <Grid item key={index} align="center">
      <Card sx={{ maxWidth: 545, minWidth: 345 }} variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {entry.date}
          </Typography>
          <Typography variant="h5" component="div">
            {entry.answer}
          </Typography>
          <Typography variant="body2">"{entry.context}"</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Link sx={{ m: 0.5 }} href={entry.url} target="_blank">
            <Box
              component="img"
              sx={{
                height: 25,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="Link Arquivo.PT"
              src={ArquivoLogo}
            />
          </Link>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  ))

  return answersRendered
}

export default Answers
