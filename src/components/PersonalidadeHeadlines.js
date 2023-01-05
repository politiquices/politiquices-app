/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
// import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
// import CardContent from '@mui/material/CardContent'
// import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import * as React from 'react'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Link from '@mui/material/Link'
import CircularIndeterminate from './utils/Circular'

const PublicoLogo = '/assets/images/logos/publico_logo.png'
const ArquivoLogo = '/assets/images/logos/arquivo_logo.png'

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

function PersonalidadeHeadlines(titles) {
  console.log(titles)

  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  if (titles.data) {
    return (
      <>
        <Grid item key="1" align="center">
          <Card sx={{ maxWidth: 640, border: '1px solid red' }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500], width: 66, height: 66 }}
                  aria-label="Cavaco Silva"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg/440px-%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg"
                />
              }
              action={
                <Avatar
                  sx={{ bgcolor: red[500], width: 66, height: 66 }}
                  aria-label="António Costa"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg/440px-2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg"
                />
              }
              title={
                <Typography gutterBottom variant="h6" component="h1">
                  September 14, 2016
                </Typography>
              }
              subheader=""
            />
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Cavaco acusa Costa de ″empurrar para a frente″ problemas de fundo da economia
              </Typography>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph align="left">
                  "Poucos meses depois de terminar o meu mandato, ganhei a convicção de que o primeiro-ministro, com a
                  cumplicidade do PCP e do BE, era mestre em gerir a conjuntura política, em capitalizar a aparência de
                  'paz social' e em empurrar para a frente os problemas de fundo da economia portuguesa: a não ser que
                  algo de muito extraordinário acontecesse, o seu Governo completaria a legislatura", escreve Cavaco
                  Silva no segundo volume do livro "Quintas-feiras e outros dias".
                </Typography>
              </CardContent>
            </Collapse>
            <CardActions disableSpacing>
              <Link sx={{ m: 0.5 }} href="http://www.publico.pt" target="_blank">
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
              <Link sx={{ m: 0.5 }} href="http://www.publico.pt" target="_blank">
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
        <Grid item key="2" align="center">
          <Card sx={{ maxWidth: 640, border: '1px solid green' }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500], width: 66, height: 66 }}
                  aria-label="Cavaco Silva"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg/440px-%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg"
                />
              }
              action={
                <Avatar
                  sx={{ bgcolor: red[500], width: 66, height: 66 }}
                  aria-label="António Costa"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg/440px-2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg"
                />
              }
              title={
                <Typography gutterBottom variant="h6" component="h1">
                  September 14, 2016
                </Typography>
              }
              subheader=""
            />
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Cavaco nomeia Vítor Bento para conselheiro de Estado
              </Typography>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph align="left">
                  Antes, Vítor Bento, licenciado em economia, foi presidente do conselho directivo do Instituto de
                  Gestão do Crédito Público, director-geral do Tesouro, director do Departamento de Estrangeiro do Banco
                  de Portugal e vogal no conselho de administração do Instituto Emissor de Macau. Foi, ainda, presidente
                  da Sedes (Associação para o Desenvolvimento Económico e Social) entre Maio de 2006 e Abril de 2008.
                </Typography>
              </CardContent>
            </Collapse>
            <CardActions disableSpacing>
              <Link sx={{ m: 0.5 }} href="http://www.publico.pt" target="_blank">
                <Box
                  component="img"
                  sx={{
                    height: 30,
                    width: 30,
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
      </>

      /*
      <Grid item key="1" align="center">
        <Card sx={{ display: 'flex' }}>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg/440px-%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg"
            alt="Live from space album cover"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                1 Abril 2022
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Cavaco acusa Costa de ″empurrar para a frente″ problemas de
                fundo da economia
              </Typography>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg/440px-2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg"
            alt="Live from space album cover"
          />
        </Card>
      </Grid>
      /*
      <Grid item key="1" align="center">
        <Card variant="outlined" sx={{ minWidth: 2 }}>
          <Typography justify="center">2022-01-01</Typography>

          <Avatar
            alt="Test"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg/440px-%D0%90%D0%BD%D0%B8%D0%B1%D0%B0%D0%BB_%D0%9A%D0%B0%D0%B2%D0%B0%D0%BA%D1%83_%D0%A1%D0%B8%D0%BB%D0%B2%D0%B0_01_%2813-06-2013%29_%28cropped%29.jpg"
            sx={{ width: 66, height: 66 }}
          />
          <Typography variant="body2">
            Cavaco acusa Costa de ″empurrar para a frente″ problemas de fundo da
            economia
          </Typography>
          <Avatar
            alt="Test"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg/440px-2022_-_On_the_floor_SZ9_6059_%2852471866651%29_%28cropped%29.jpg"
            sx={{ width: 66, height: 66 }}
          />
        </Card>
      </Grid>
      */
    )
  }
  /*
    return titles.data.map((item, index) => (
      <Grid item key={index} align="center">
        <Typography justify="center">{item.date}</Typography>
        <Link href={item.url} target="_blank">
          <Typography justify="center">{item.title}</Typography>
        </Link>
      </Grid>
    ))
    */
  return <CircularIndeterminate />
}

function FetchPersonalidadeHeadlines() {
  const { id } = useParams()
  const [headlines, setHeadlines] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const fetchData = () => {
    fetch(`http://localhost:8000/personality/relationships/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setHeadlines(data)
        console.log(data)
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

  if (isLoading) {
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
      sx={{ paddingTop: 2 }}
    >
      {headlines && <PersonalidadeHeadlines data={headlines} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default FetchPersonalidadeHeadlines
