import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Link from '@material-ui/core/Link'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const PublicoLogo = 'assets/images/logos/publico_logo.png'
const ArquivoLogo = 'assets/images/logos/arquivo_logo.png'
const Supports = 'assets/images/logos/handshake.png'
const Opposes = 'assets/images/logos/discrimination.png'
const Neutral = 'assets/images/logos/conversation.png'

function ProcessArticleLink(relType) {
  // eslint-disable-next-line react/destructuring-assignment
  if (relType.startsWith('https://publico.pt')) {
    return <img width="15" src={PublicoLogo} alt="publico.pt" />
  }
  return <img width="35" src={ArquivoLogo} alt="arquivo.pt" />
}

// loads news titles
function NewsTitles(props) {
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

  const headlines = data.map((RawData) => ({
    title: RawData.title.value,
    url: RawData.arquivo_doc.value,
    url_image: ProcessArticleLink(RawData.arquivo_doc.value),
    date: RawData.date.value,
    rel_type: RawData.rel_type.value,
    rel_image: ProcessRelationship(RawData.rel_type.value),

    main_ent_image: RawData.ent1_img.image_url,
    main_ent_name: RawData.ent1_str.value,
    main_ent_url: RawData.ent1.value.match(/Q\d+/g)[0],

    other_ent_image: RawData.ent2_img.image_url,
    other_ent_name: RawData.ent2_str.value,
    other_ent_url: RawData.ent2.value.match(/Q\d+/g)[0],
  }))

  return headlines.map((entry, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Grid item key={index} sx={{ paddingTop: 1.5 }} width={450}>
      <Card variant="elevation" raised="true">
        <CardContent>
          {/* Date */}
          <Grid container>
            <Grid item alignContent="center">
              <Typography
                variant="subtitle1"
                component="div"
                className="title-card"
                gutterBottom
              >
                {entry.date}
              </Typography>
            </Grid>
          </Grid>

          {/* Entities */}
          <Grid container>
            <Grid item xs={2} />
            <Grid item xs={3}>
              <Link
                href={`personalidade/${entry.main_ent_url}`}
                target="_blank"
              >
                <Avatar
                  alt={entry.focus_ent}
                  src={entry.main_ent_image}
                  sx={{ width: 66, height: 66 }}
                />
                {entry.main_ent_name}
              </Link>
            </Grid>

            <Grid item xs={2}>
              <Link target="_blank">
                <img width="40" src={entry.rel_image} alt={entry.rel_type} />
              </Link>
            </Grid>

            <Grid item xs={3}>
              <Link
                href={`personalidade/${entry.other_ent_url}`}
                target="_blank"
              >
                <Avatar
                  alt={entry.other_ent_name}
                  src={entry.other_ent_image}
                  sx={{ width: 66, height: 66 }}
                />
                {entry.other_ent_name}
              </Link>
            </Grid>

            <Grid item xs={2} />
          </Grid>

          {/* Title */}
          <Grid container spacing={1} sx={{ paddingTop: 2 }}>
            <Grid item>
              <Typography
                variant="h7"
                component="div"
                align="center"
                fontWeight="450"
              >
                {entry.title}
                <Link sx={{ m: 0.5 }} href={entry.url} target="_blank">
                  {entry.url_image}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  ))
}

export default NewsTitles
