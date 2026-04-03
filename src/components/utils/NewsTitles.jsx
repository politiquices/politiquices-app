/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit';
import Collapse from '@mui/material/Collapse'
import { red } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { postCorrection } from '../../api'
// import { Stack } from '@mui/material'

const ArquivoLogo = '/assets/images/logos/arquivo_logo.png'
const AEIOU = '/assets/images/jornais/logotipo-aeiou-2010-240.png'
const CorreioAlentejo = '/assets/images/jornais/correio_alentejo.png'
const DN = '/assets/images/jornais/diario_noticias.jpg'
const DESTAK = '/assets/images/jornais/Destak_logo.svg'
const DiarioDigital = '/assets/images/jornais/diariodigital.gif'
const ECO = '/assets/images/jornais/eco.png'
const Expresso = '/assets/images/jornais/expresso.png'
const Ionline = '/assets/images/jornais/i_online.png'
const JornalEconomico = '/assets/images/jornais/JE_logo.png'
const JN = '/assets/images/jornais/jornal_noticias.jpg'
const JornalNegocios = '/assets/images/jornais/jornal_negocios.png'
const Observador = '/assets/images/jornais/observador.png'
const PublicoLogo = '/assets/images/logos/publico_logo.png'
const RTP = '/assets/images/jornais/rtp.svg.png'
const SAPO = '/assets/images/jornais/Logo_SAPO.png'
const Sabado = '/assets/images/jornais/Revista_Sábado_logo.png'
const Sol = '/assets/images/jornais/sol.png'
const SICNoticias = '/assets/images/jornais/SIC_noticias.png'
const TSF = '/assets/images/jornais/tsf.png'
const TVI = '/assets/images/jornais/Logótipo_TVI.png'

// const Supports = 'assets/images/logos/handshake.png'
// const Opposes = 'assets/images/logos/discrimination.png'
// const Neutral = 'assets/images/logos/conversation.png'

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

  dc:creator "guimaraesdigital.com"^^xsd:string
  dc:creator "imediato.pt"^^xsd:string
  dc:creator "iol.pt"^^xsd:string
  dc:creator "jm-madeira.pt"^^xsd:string
  dc:creator "jornaldamadeira.pt"^^xsd:string
  dc:creator "jornaldiabo.com"^^xsd:string
  dc:creator "jornaldoalgarve.pt"^^xsd:string
  dc:creator "jornaldofundao.pt"^^xsd:string
  dc:creator "linhasdeelvas.pt"^^xsd:string
  dc:creator "ointerior.pt"^^xsd:string
  dc:creator "omirante.pt"^^xsd:string
  dc:creator "osetubalense.com"^^xsd:string
  dc:creator "postal.pt"^^xsd:string
  dc:creator "regiao-sul.pt"^^xsd:string
  dc:creator "regiaodeleiria.pt"^^xsd:string
  dc:creator "rr.pt"^^xsd:string
  dc:creator "terrasdabeira.gmpress.pt"^^xsd:string
  dc:creator "visao.sapo.pt"^^xsd:string
  dc:creator "zap.aeiou.pt"^^xsd:string
  */

  const mappings = {};
  
  mappings['aeiou.pt'] = AEIOU;
  mappings['aeiou.visao.pt'] = AEIOU;
  mappings['zap.aeiou.pt'] = AEIOU;
  mappings['correioalentejo.com'] = CorreioAlentejo;
  mappings['destak.pt'] = DESTAK;
  mappings['dn.pt'] = DN;
  mappings['dn.sapo.pt'] = DN;
  mappings['dnoticias.pt'] = DN;
  mappings['diariodigital.sapo.pt'] = DiarioDigital;  
  mappings['eco.sapo.pt'] = ECO;
  mappings['expresso.pt'] = Expresso;
  mappings['expresso.sapo.pt'] = Expresso;
  mappings['online.expresso.pt'] = Expresso;
  mappings['ionline.sapo.pt'] = Ionline;
  mappings['ionline.pt'] = Ionline;
  mappings['jn.pt'] = JN;
  mappings['jn.sapo.pt'] = JN;
  mappings['jn.sapo.pt'] = JN;
  mappings['jornaldenegocios.pt'] = JornalNegocios;
  mappings['jornaleconomico.sapo.pt'] = JornalEconomico;
  mappings['economico.sapo.pt'] = JornalEconomico;
  mappings['noticias.sapo.pt'] = SAPO;
  mappings['observador.pt'] = Observador;
  mappings['publico.pt'] = PublicoLogo;
  mappings['publico.clix.pt'] = PublicoLogo;
  mappings['rtp.pt'] = RTP;
  mappings['sabado.pt'] = Sabado;
  mappings['sapo.pt'] = SAPO;
  mappings['sicnoticias.pt'] = SICNoticias;
  mappings['sicnoticias.sapo.pt'] = SICNoticias;
  mappings['sol.sapo.pt'] = Sol;
  mappings['tsf.pt'] = TSF;
  mappings['tvi24.iol.pt'] = TVI;

  if (domain in mappings) {
    return mappings[domain];
  }
  return PublicoLogo;
}


// loads news titles
function NewsTitles(props) {
  const [isOpenCollapse, setIsOpenCollapse] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNewsIndex, setSelectedNewsIndex] = React.useState(null);

  const { data } = props;

  if (data.length === 0) {
    return (
      <Grid item sx={{ paddingTop: 1.5 }}>
        <Alert severity="info">Não foram encontrados resultados.</Alert>
      </Grid>
    );
  }

  const headlines = data.map((RawData) => {
    const isReverse = RawData.rel_type === 'opposed_by' || RawData.rel_type === 'supported_by'
    return {
      title: RawData.title,
      paragraph: RawData.paragraph,
      url: RawData.arquivo_doc,
      date: RawData.date,
      rel_type: RawData.rel_type,
      original_url: RawData.original_url,
      original_url_image: ProcessArticleLink(RawData.domain),
      main_ent_image: isReverse ? RawData.ent2_img : RawData.ent1_img,
      main_ent_name: isReverse ? RawData.ent2_str : RawData.ent1_str,
      main_ent_url: isReverse ? RawData.ent2_id : RawData.ent1_id,
      other_ent_image: isReverse ? RawData.ent1_img : RawData.ent2_img,
      other_ent_name: isReverse ? RawData.ent1_str : RawData.ent2_str,
      other_ent_url: isReverse ? RawData.ent1_id : RawData.ent2_id,
    }
  });

  const handleOpen = (clickedIndex) => {
    if (isOpenCollapse === clickedIndex) {
      setIsOpenCollapse(null);
    } else {
      setIsOpenCollapse(clickedIndex);
    }
  };

  const handleCorrectClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedNewsIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedNewsIndex(null);
  };

  const handleRelationshipSelect = async (relationship) => {
    if (selectedNewsIndex !== null) {
      const selectedNews = headlines[selectedNewsIndex];
      const dataToSend = {
          title: selectedNews.title,
          selectedRelationship: relationship,
          paragraph: selectedNews.paragraph,
          url: selectedNews.url,
          date: selectedNews.date,
          main_ent_name: selectedNews.main_ent_name,
          main_ent_url: selectedNews.main_ent_url,
          other_ent_name: selectedNews.other_ent_name,
          other_ent_url: selectedNews.other_ent_url,
          original_rel_type: selectedNews.rel_type,
          timestamp: new Date().toISOString(),
      };

      try {
        await postCorrection(dataToSend);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
    handleClose();
  };

  const relTypeStyle = (relType) => {
    switch (relType) {
      case 'ent1_supports_ent2':
      case 'ent2_supports_ent1':
      case 'supports':
      case 'supported_by':
        return { label: 'apoia', color: '#44861E', bg: '#e8f5e9', border: '#44861E' }
      case 'ent1_opposes_ent2':
      case 'ent2_opposes_ent1':
      case 'opposes':
      case 'opposed_by':
        return { label: 'opõe-se', color: '#c62828', bg: '#ffebee', border: '#FF0000' }
      default:
        return { label: 'outro', color: '#757575', bg: '#f5f5f5', border: '#bdbdbd' }
    }
  };

  const titlesRendered = headlines.map((entry, index) => (
    <Grid item key={index} xs={12} sm={6} sx={{ display: 'flex' }}>
      <Card sx={{
        width: '100%',
        margin: '0.5rem',
        position: 'relative',
        borderTop: `4px solid ${relTypeStyle(entry.rel_type).border}`,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
      }}>
        {/* Avatars + sentiment chip */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 2, pt: 2 }}>
          {/* Left entity */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
            <Link href={`/personalidade/${entry.main_ent_url}`}>
              <Avatar
                sx={{ bgcolor: red[500], width: 72, height: 72 }}
                aria-label={entry.main_ent_name}
                src={entry.main_ent_image}
              />
            </Link>
            <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'center', width: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.main_ent_name}
            </Typography>
          </Box>

          {/* Centre: date + sentiment chip */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, px: 1, pt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
              {dateConverter({ dateString: entry.date })}
            </Typography>
            <Chip
              label={relTypeStyle(entry.rel_type).label}
              size="small"
              sx={{
                fontWeight: 'bold',
                bgcolor: relTypeStyle(entry.rel_type).bg,
                color: relTypeStyle(entry.rel_type).color,
              }}
            />
          </Box>

          {/* Right entity */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
            <Link href={`/personalidade/${entry.other_ent_url}`}>
              <Avatar
                sx={{ bgcolor: red[500], width: 72, height: 72 }}
                aria-label={entry.other_ent_name}
                src={entry.other_ent_image}
              />
            </Link>
            <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'center', width: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.other_ent_name}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ pt: 1 }}>
          <Typography variant="body1" align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
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
          <ExpandMore onClick={() => handleOpen(index)} expand={isOpenCollapse === index} aria-expanded={isOpenCollapse === index} aria-label="show more">
            <ExpandMoreIcon />          
          </ExpandMore>
          </IconButton>
        </CardActions>
        
        {/* Corrigir button positioned absolutely */}
        <Button
          size="small"
          onClick={(event) => handleCorrectClick(event, index)}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
          }}
        >
          <EditIcon />
        </Button>
      </Card>
    </Grid>
  ));

  return (
    <>
      <Grid container direction="row" flexWrap="wrap" justifyContent="center">
        {titlesRendered}
      </Grid>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleRelationshipSelect('ent1_supports_ent2')}>ent1 supports ent2</MenuItem>
        <MenuItem onClick={() => handleRelationshipSelect('ent1_opposes_ent2')}>ent1 opposes ent2</MenuItem>
        <MenuItem onClick={() => handleRelationshipSelect('ent2_supports_ent1')}>ent2 supports ent1</MenuItem>
        <MenuItem onClick={() => handleRelationshipSelect('ent2_opposes_ent1')}>ent2 opposes ent1</MenuItem>
        <MenuItem onClick={() => handleRelationshipSelect('other')}>other</MenuItem>
      </Menu>
    </>
  );
}

export default NewsTitles