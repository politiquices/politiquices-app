import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import YoutubeEmbed from './utils/YoutubeEmbed'

function Sobre() {
  return (
    <>
      <Typography sx={{ paddingTop: 10 }} align="center">
        Perguntas Frequentes
      </Typography>
      <Typography align="center"> - Porque é que algumas personalidades não têm foto?</Typography>
      <Typography align="center">Algumas personalidades têm a informação pessoal errada ou incompleta</Typography>
      <Typography align="center"> - Porque é que apenas há dados até 2021 ?</Typography>
      <Typography align="center">
        Os dados usados pelo politiquices.pt provêm do Arquivo.PT que apenas pública as páginas um ano depois de terme
        sido arquivadas
      </Typography>

      <Box align="center" sx={{ paddingTop: 10 }}>
        <Typography align="center">Apresentação Café com Arquivo.PT 2022</Typography>
        <YoutubeEmbed embedId="lfNS_F84N6k" />
      </Box>

      <Typography sx={{ paddingTop: 10 }} align="center">
        Tech Stack
      </Typography>
      <Typography align="center">Apache Jena</Typography>
      <Typography align="center">React MUI</Typography>
    </>
  )
}

export default Sobre
