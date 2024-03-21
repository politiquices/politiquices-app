import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import YoutubeEmbed from './utils/YoutubeEmbed'

function Sobre() {
  return (
    <>
      <Typography sx={{ paddingTop: 10 }} align="center"> Perguntas Frequentes</Typography>
      <Typography align="center">
        Os dados usados pelo politiquices.pt provêm do Arquivo.PT que apenas pública as páginas um ano depois de terem 
        sido arquivadas
      </Typography>
      <Box align="center" sx={{ paddingTop: 10 }}>
        <YoutubeEmbed embedId="lfNS_F84N6k" />
        <Typography align="center">Apresentação Café com Arquivo.PT 2022</Typography>
      </Box>
    </>
  )
}

export default Sobre
