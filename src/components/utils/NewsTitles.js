/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
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
// import { Stack } from '@mui/material'

const ArquivoLogo = '/assets/images/logos/arquivo_logo.png'
const AEIOU = '/assets/images/jornais/logotipo-aeiou-2010-240.png'
const DN = '/assets/images/jornais/diario_noticias.jpg'
const DESTAK = '/assets/images/jornais/Destak_logo.svg'
const DiarioDigital = '/assets/images/jornais/diariodigital.gif'
const Expresso = '/assets/images/jornais/expresso.png'
const Ionline = '/assets/images/jornais/i_online.png'
const JornalEconomico = '/assets/images/jornais/JE_logo.png'
const JN = '/assets/images/jornais/jornal_noticias.jpg'
const JornalNegocios = '/assets/images/jornais/jornal_negocios.png'
const Observador = '/assets/images/jornais/observador.png'
const PublicoLogo = '/assets/images/logos/publico_logo.png'
const RTP = '/assets/images/jornais/rtp.svg.png'
const TSF = '/assets/images/jornais/tsf.png'
const TVI = '/assets/images/jornais/Logótipo_TVI.png'

// const Supports = 'assets/images/logos/handshake.png'
// const Opposes = 'assets/images/logos/discrimination.png'
// const Neutral = 'assets/images/logos/conversation.png'

const ExpandMore = styled((props) => {
  
  // const expand = props['aria-expanded']
  // console.log('props: ', props)
  // console.log('expanded: ', expand)
  const { ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

function dateConverter({ dateString }) {
  
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const monthIndex = dateObj.getMonth();
    const monthName = months[monthIndex];
    const day = dateObj.getDate();

    return `${day} ${monthName} de ${year}`;
  
}

function ProcessArticleLink(domain) {

  /*
  dc:creator "PUBLICO-CHAVE"^^xsd:string
  dc:creator "acorianooriental.pt"^^xsd:string
  dc:creator "anoticia.pt"^^xsd:string
  dc:creator "asbeiras.pt"^^xsd:string
  dc:creator "avozdetrasosmontes.pt"^^xsd:string
  dc:creator "cmpt"^^xsd:string
  dc:creator "correioalentejo.com"^^xsd:string
  dc:creator "correiodominho.com"^^xsd:string
  dc:creator "diarioaveiro.pt"^^xsd:string
  dc:creator "diariocoimbra.pt"^^xsd:string
  dc:creator "diariodetrasosmontes.com"^^xsd:string
  dc:creator "diariodigitalcastelobranco.pt"^^xsd:string
  dc:creator "diariodominho.pt"^^xsd:string
  dc:creator "diariodosacores.pt"^^xsd:string
  dc:creator "diariodosul.com.pt"^^xsd:string
  dc:creator "diarioleiria.pt"^^xsd:string
  dc:creator "diarioviseu.pt"^^xsd:string
  dc:creator "dinheirodigital.sapo.pt"^^xsd:string
  dc:creator "dinheirovivo.pt"^^xsd:string
  dc:creator "eco.sapo.pt"^^xsd:string
  dc:creator "economico.sapo.pt"^^xsd:string
  dc:creator "guimaraesdigital.com"^^xsd:string
  dc:creator "imediato.pt"^^xsd:string
  dc:creator "iol.pt"^^xsd:string
  dc:creator "jm-madeira.pt"^^xsd:string
  dc:creator "jornaldamadeira.pt"^^xsd:string
  dc:creator "jornaldiabo.com"^^xsd:string
  dc:creator "jornaldoalgarve.pt"^^xsd:string
  dc:creator "jornaldofundao.pt"^^xsd:string
  dc:creator "linhasdeelvas.pt"^^xsd:string
  dc:creator "noticias.sapo.pt"^^xsd:string
  dc:creator "ointerior.pt"^^xsd:string
  dc:creator "omirante.pt"^^xsd:string
  dc:creator "online.expresso.pt"^^xsd:string
  dc:creator "osetubalense.com"^^xsd:string
  dc:creator "postal.pt"^^xsd:string
  dc:creator "regiao-sul.pt"^^xsd:string
  dc:creator "regiaodeleiria.pt"^^xsd:string
  dc:creator "rr.pt"^^xsd:string
  dc:creator "sabado.pt"^^xsd:string
  dc:creator "sapo.pt"^^xsd:string
  dc:creator "sicnoticias.pt"^^xsd:string
  dc:creator "sicnoticias.sapo.pt"^^xsd:string
  dc:creator "sol.sapo.pt"^^xsd:string
  dc:creator "terrasdabeira.gmpress.pt"^^xsd:string
  dc:creator "visao.sapo.pt"^^xsd:string
  dc:creator "zap.aeiou.pt"^^xsd:string
  */

  const mappings = {};
  
  mappings['aeiou.pt'] = AEIOU;
  mappings['aeiou.visao.pt'] = AEIOU;
  mappings['zap.aeiou.pt'] = AEIOU;
  mappings['destak.pt'] = DESTAK;
  mappings['dn.pt'] = DN;
  mappings['dn.sapo.pt'] = DN;
  mappings['dnoticias.pt'] = DN;
  mappings['diariodigital.sapo.pt'] = DiarioDigital;  
  mappings['expresso.pt'] = Expresso;
  mappings['expresso.sapo.pt'] = Expresso;
  mappings['ionline.sapo.pt'] = Ionline;
  mappings['ionline.pt'] = Ionline;
  mappings['jn.pt'] = JN;
  mappings['jn.sapo.pt'] = JN;
  mappings['jn.sapo.pt'] = JN;
  mappings['jornaldenegocios.pt'] = JornalNegocios;
  mappings['jornaleconomico.sapo.pt'] = JornalEconomico;
  mappings['publico.pt'] = PublicoLogo;
  mappings['publico.clix.pt'] = PublicoLogo;
  mappings['observador.pt'] = Observador;
  mappings['rtp.pt'] = RTP;
  mappings['tsf.pt'] = TSF;
  mappings['tvi24.iol.pt'] = TVI;

  if (domain in mappings) {
    return mappings[domain];
  }
  return PublicoLogo;
}


// loads news titles
function NewsTitles(props) {
  const [isOpenCollapse, setIsOpenCollapse] = React.useState(null)

  const handleOpen = (clickedIndex) => {
    if (isOpenCollapse === clickedIndex) {
      setIsOpenCollapse(null)
    } else {
      setIsOpenCollapse(clickedIndex)
    }
  }

  const { data } = props

  if (data.length === 0) {
    return (
      <Grid item sx={{ paddingTop: 1.5 }}>
        <Alert severity="info">Não foram encontrados resultados.</Alert>
      </Grid>
    )
  }

const translateRelType = (rel_type) => {
  let translatedText;
  let color;


  // Translate rel_type and assign color
  switch (rel_type.rel_type) {
    case 'ent1_opposes_ent2':
    case 'opposes':
      translatedText = 'opõe-se';
      color = 'red';
      break;
    case 'ent1_supports_ent2':
    case 'supports':
      translatedText = 'apoia';
      color = 'green';
      break;
    default:
      // For any other rel_type, return null
      return null;
  }

  // Return JSX element with translated text and color
  return (
    <span style={{ color }}>{translatedText}</span>
  );
};

  const headlines = data.map((RawData) => ({
    title: RawData.title,
    paragraph: RawData.paragraph,
    url: RawData.arquivo_doc,
    date: RawData.date,
    rel_type: RawData.rel_type,
    
    // rel_image: ProcessRelationship(RawData.rel_type),
    
    original_url: RawData.original_url,
    original_url_image: ProcessArticleLink(RawData.domain),

    main_ent_image: RawData.ent1_img,
    main_ent_name: RawData.ent1_str,
    main_ent_url: RawData.ent1_id,

    other_ent_image: RawData.ent2_img,
    other_ent_name: RawData.ent2_str,
    other_ent_url: RawData.ent2_id,
  }))

  const titlesRendered = headlines.map((entry, index) => (
    <Grid item key={index} align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 750, margin: '1rem' }}>
        <CardHeader
          avatar={
            <Link href={`/personalidade/${entry.main_ent_url}`}>
              <Avatar
                sx={{ bgcolor: red[500], width: 66, height: 66 }}
                aria-label={entry.main_ent_name}
                src={entry.main_ent_image}
              />
            </Link>
          }
          action={
            <Link href={`/personalidade/${entry.other_ent_url}`}>
              <Avatar
                sx={{ bgcolor: red[500], width: 66, height: 66 }}
                aria-label={entry.other_ent_name}
                src={entry.other_ent_image}
              />
            </Link>
          }
          title={
            <Typography gutterBottom variant="h6" component="h1">
              {dateConverter({ dateString: entry.date })}      
            </Typography>
          }
          subheader={
            <Typography variant="h6" color="text.primary" style={{fontWeight: "bold"}}>
              {translateRelType({ rel_type: entry.rel_type })}
            </Typography>}
        />
        <CardContent>
          <Typography variant="h6" color="text.secondary" 
          style={{ 
            color: "black", 
            // fontFamily: "Times New Roman, Times, serif" 
            // fontFamily: "Lobster, serif"
            // fontFamily: "Playfair Display, serif"
            // fontFamily: "Pacifico, serif"
            // fontFamily: "Merriweather, serif"
            }}>
            {entry.title}
          </Typography>
        </CardContent>

        <Collapse in={isOpenCollapse === index} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph align="left">
              {entry.paragraph}
            </Typography>
          </CardContent>
        </Collapse>
        <CardActions>
        {entry.url !== entry.original_url && entry.url.includes("arquivo.pt") && (
          <Link href={entry.url} target="_blank">
            <Box
              component="img"
              sx={{
                height: 33,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="Link Arquivo.PT"
              src={ArquivoLogo}
            />
          </Link>
        )}
          <Link href={entry.original_url} target="_blank">
            <Box
              component="img"
              sx={{
                height: 25,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="Link Original"
              src={entry.original_url_image}
            />
          </Link>
          <IconButton>
          <ExpandMore onClick={() => handleOpen(index)} aria-expanded={isOpenCollapse === index} aria-label="show more">
            <ExpandMoreIcon />          
          </ExpandMore>
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  ))

  return titlesRendered
}

export default NewsTitles
