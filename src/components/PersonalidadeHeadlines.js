/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import * as React from 'react'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { red } from '@mui/material/colors'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from '@mui/material/Link'
import NewsTitles from './utils/NewsTitles'
import CircularIndeterminate from './utils/Circular'

/*
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
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  if (titles.data.sentiment) {
    // relationships = Object.keys(titles.data)
    // rel_type: X

    const titlesRendered = titles.data.sentiment.map((item, index) => (
      <Grid item key={index} align="center">
        <Card sx={{ maxWidth: 545, minWidth: 345, margin: '1rem', border: '1px solid red' }}>
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: red[500], width: 66, height: 66 }}
                aria-label={item.focus_ent_name}
                src={item.focus_ent_img}
              />
            }
            action={
              <Avatar
                sx={{ bgcolor: red[500], width: 66, height: 66 }}
                aria-label={item.other_ent_name}
                src={item.other_ent_img}
              />
            }
            title={
              <Typography gutterBottom variant="h6" component="h1">
                {item.date}
              </Typography>
            }
            subheader=""
          />
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              {item.title}
            </Typography>
          </CardContent>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph align="left">
                "Poucos meses depois de terminar o meu mandato, ganhei a convicção de que o primeiro-ministro, com a
                cumplicidade do PCP e do BE, era mestre em gerir a conjuntura política, em capitalizar a aparência de
                'paz social' e em empurrar para a frente os problemas de fundo da economia portuguesa: a não ser que
                algo de muito extraordinário acontecesse, o seu Governo completaria a legislatura", escreve Cavaco Silva
                no segundo volume do livro "Quintas-feiras e outros dias".
              </Typography>
            </CardContent>
          </Collapse>
          <CardActions disableSpacing>
            <Link sx={{ m: 0.5 }} href={item.url} target="_blank">
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
            <Link sx={{ m: 0.5 }} href={item.url} target="_blank">
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

  return <CircularIndeterminate />
}
*/

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
      {headlines.sentiment && <NewsTitles data={headlines.sentiment} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>
  )
}

export default FetchPersonalidadeHeadlines
