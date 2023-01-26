/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import ShareIcon from '@mui/icons-material/Share'
import Link from '@material-ui/core/Link'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import { red } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

const PublicoLogo = '../assets/images/logos/publico_logo.png'
const ArquivoLogo = '../assets/images/logos/arquivo_logo.png'

const Supports = 'assets/images/logos/handshake.png'
const Opposes = 'assets/images/logos/discrimination.png'
const Neutral = 'assets/images/logos/conversation.png'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

function ProcessArticleLink(url) {
  // eslint-disable-next-line react/destructuring-assignment
  if (url.startsWith('https://publico.pt')) {
    return <img width="15" src={PublicoLogo} alt="publico.pt" />
  }
  return <img width="35" src={ArquivoLogo} alt="arquivo.pt" />
}

// loads news titles
function NewsTitles(props) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const { data } = props

  if (data.length === 0) {
    return (
      <Grid item sx={{ paddingTop: 1.5 }}>
        <Alert severity="info">Não foram encontrados resultados.</Alert>
      </Grid>
    )
  }
  function ProcessRelationship(RelType) {
    if (RelType.includes('opposes')) {
      return Opposes
    }
    if (RelType.includes('supports')) {
      return Supports
    }
    return Neutral
  }

  console.log('inside news title')
  console.log(data)

  const headlines = data.map((RawData) => ({
    title: RawData.title,
    url: RawData.arquivo_doc,
    date: RawData.date,
    rel_type: RawData.rel_type,
    // url_image: ProcessArticleLink(RawData.arquivo_doc),
    // rel_image: ProcessRelationship(RawData.rel_type),

    main_ent_image: RawData.ent1_img,
    main_ent_name: RawData.ent1_str,
    main_ent_url: RawData.ent1_id,

    other_ent_image: RawData.ent2_img,
    other_ent_name: RawData.ent2_str,
    other_ent_url: RawData.ent2_id,
  }))

  console.log('headlines')
  console.log(headlines)

  const titlesRendered = headlines.map((entry, index) => (
    <Grid item key={index} align="center">
      <Card sx={{ maxWidth: 545, minWidth: 345, margin: '1rem', border: '1px solid red' }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500], width: 66, height: 66 }}
              aria-label={entry.main_ent_name}
              src={entry.main_ent_image}
            />
          }
          action={
            <Avatar
              sx={{ bgcolor: red[500], width: 66, height: 66 }}
              aria-label={entry.other_ent_name}
              src={entry.other_ent_image}
            />
          }
          title={
            <Typography gutterBottom variant="h6" component="h1">
              {entry.date}
            </Typography>
          }
          subheader=""
        />
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            {entry.title}
          </Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph align="left">
              "Poucos meses depois de terminar o meu mandato, ganhei a convicção de que o primeiro-ministro, com a
              cumplicidade do PCP e do BE, era mestre em gerir a conjuntura política, em capitalizar a aparência de 'paz
              social' e em empurrar para a frente os problemas de fundo da economia portuguesa: a não ser que algo de
              muito extraordinário acontecesse, o seu Governo completaria a legislatura", escreve Cavaco Silva no
              segundo volume do livro "Quintas-feiras e outros dias".
            </Typography>
          </CardContent>
        </Collapse>
        <CardActions disableSpacing>
          <Link sx={{ m: 0.5 }} href={entry.url} target="_blank">
            <Box
              component="img"
              sx={{
                height: 25,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src={ArquivoLogo}
            />
          </Link>
          <Link sx={{ m: 0.5 }} href={entry.url} target="_blank">
            <Box
              component="img"
              sx={{
                height: 25,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src={PublicoLogo}
            />
          </Link>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </Card>
    </Grid>
  ))

  return titlesRendered
}

export default NewsTitles
