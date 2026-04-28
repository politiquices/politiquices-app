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
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import { red } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip';
import { COLOR_SUPPORTS, COLOR_OPPOSES, COLOR_SUPPORTS_BG, COLOR_OPPOSES_BG } from '../../constants'
import { useTranslation } from 'react-i18next'
// import { Stack } from '@mui/material'

const ANNOTATOR_URL = import.meta.env.VITE_ANNOTATOR_URL || 'http://localhost:5174'

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

const DOMAIN_LOGOS = {
  'aeiou.pt':                AEIOU,
  'aeiou.visao.pt':          AEIOU,
  'zap.aeiou.pt':            AEIOU,
  'correioalentejo.com':     CorreioAlentejo,
  'destak.pt':               DESTAK,
  'dn.pt':                   DN,
  'dn.sapo.pt':              DN,
  'dnoticias.pt':            DN,
  'diariodigital.sapo.pt':   DiarioDigital,
  'eco.sapo.pt':             ECO,
  'expresso.pt':             Expresso,
  'expresso.sapo.pt':        Expresso,
  'online.expresso.pt':      Expresso,
  'ionline.sapo.pt':         Ionline,
  'ionline.pt':              Ionline,
  'jn.pt':                   JN,
  'jn.sapo.pt':              JN,
  'jornaldenegocios.pt':     JornalNegocios,
  'jornaleconomico.sapo.pt': JornalEconomico,
  'economico.sapo.pt':       JornalEconomico,
  'noticias.sapo.pt':        SAPO,
  'observador.pt':           Observador,
  'publico.pt':              PublicoLogo,
  'publico.clix.pt':         PublicoLogo,
  'rtp.pt':                  RTP,
  'sabado.pt':               Sabado,
  'sapo.pt':                 SAPO,
  'sicnoticias.pt':          SICNoticias,
  'sicnoticias.sapo.pt':     SICNoticias,
  'sol.sapo.pt':             Sol,
  'tsf.pt':                  TSF,
  'tvi24.iol.pt':            TVI,
}


function useDateConverter() {
  const { t } = useTranslation()
  return function dateConverter(dateString) {
    const dateObj = new Date(dateString)
    const year = dateObj.getFullYear()
    const monthIndex = dateObj.getMonth()
    const month = t(`news.months.${monthIndex}`)
    const day = dateObj.getDate()
    return t('news.dateFormat', { day, month, year })
  }
}

function ProcessArticleLink(domain) {
  return DOMAIN_LOGOS[domain] ?? PublicoLogo
}


// loads news titles
function NewsTitles(props) {
  const { t } = useTranslation()
  const dateConverter = useDateConverter()
  const [isOpenCollapse, setIsOpenCollapse] = React.useState(null);

  const { data } = props;

  if (data.length === 0) {
    return (
      <Grid item sx={{ paddingTop: 1.5 }}>
        <Alert severity="info">{t('news.noResults')}</Alert>
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

  const relTypeStyle = (relType) => {
    switch (relType) {
      case 'ent1_supports_ent2':
      case 'ent2_supports_ent1':
      case 'supports':
      case 'supported_by':
        return { label: t('news.supportsLabel'), color: COLOR_SUPPORTS, bg: COLOR_SUPPORTS_BG, border: COLOR_SUPPORTS }
      case 'ent1_opposes_ent2':
      case 'ent2_opposes_ent1':
      case 'opposes':
      case 'opposed_by':
        return { label: t('news.opposesLabel'), color: COLOR_OPPOSES, bg: COLOR_OPPOSES_BG, border: COLOR_OPPOSES }
      default:
        return { label: t('news.otherLabel'), color: '#757575', bg: '#f5f5f5', border: '#bdbdbd' }
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
              {dateConverter(entry.date)}
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
                alt={t('news.arquivoLink')}
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
              alt={t('news.originalLink')}
              src={entry.original_url_image}
            />
          </Link>
          <Button
            onClick={() => handleOpen(index)}
            aria-expanded={isOpenCollapse === index}
            size="small"
            sx={{ textTransform: 'none', fontSize: '0.85rem', ml: 1.5 }}
          >
            {isOpenCollapse === index ? t('news.showLess') : t('news.showMore')}
          </Button>
        </CardActions>
        
        <IconButton
          size="small"
          title="Abrir no anotador"
          onClick={() => {
            const annotatorUrl = `${ANNOTATOR_URL}/?url=${encodeURIComponent(entry.url)}&source=sparql`;
            window.open(annotatorUrl, '_blank');
          }}
          sx={{ position: 'absolute', bottom: 8, right: 8 }}
        >
          <FlagOutlinedIcon fontSize="small" />
        </IconButton>
      </Card>
    </Grid>
  ));

  return (
    <>
      <Grid container direction="row" flexWrap="wrap" justifyContent="center">
        {titlesRendered}
      </Grid>
    </>
  );
}

export default NewsTitles