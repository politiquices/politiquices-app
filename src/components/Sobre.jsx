import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import StorageIcon from '@mui/icons-material/Storage'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'

const FAQ = [
  {
    q: 'Como são obtidos os dados do Politiquices?',
    a: 'Os dados provêm do Arquivo.PT, um serviço que arquiva páginas da web e só disponibiliza as páginas um ano após serem arquivadas.',
  },
  {
    q: 'Quando é que os dados são atualizados?',
    a: 'Os dados são atualizados anualmente, de acordo com as políticas de disponibilização do Arquivo.PT.',
  },
  {
    q: 'O que é o Arquivo.PT?',
    a: 'O Arquivo.PT é um serviço público que preserva conteúdos da web portuguesa, permitindo consultar versões antigas de sites.',
  },
]

function Sobre() {
  return (
    <Box sx={{ paddingTop: 10 }}>

      {/* Hero */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          O que é Politiquices.PT?
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          O Politiquices.PT foi desenvolvido no âmbito dos prémios Arquivo.PT 2021 cruzando dados do
          Arquivo.PT com dados da Wikidata. Estes dados são disponibilizados através de um endpoint
          SPARQL, que é a base de dados que alimenta a página web do Politiquices.PT.
        </Typography>

        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StorageIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              Endpoint SPARQL:{' '}
              <Link href="http://sparql.politiquices.pt" target="_blank">
                sparql.politiquices.pt
              </Link>
              {' — '}
              <Link href="https://github.com/politiquices/SPARQL-endpoint/blob/main/tutorials/sparql_queries.md" target="_blank">
                exemplos de queries
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <OndemandVideoIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              <Link href="https://www.youtube.com/watch?v=lfNS_F84N6k" target="_blank">
                Vídeo de apresentação
              </Link>
              {' '}no âmbito dos seminários Café com Arquivo.PT 2022
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* FAQ */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <InfoOutlinedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Perguntas Frequentes
          </Typography>
        </Stack>

        {FAQ.map((item) => (
          <Accordion
            key={item.q}
            disableGutters
            elevation={0}
            sx={{
              '&:before': { display: 'none' },
              border: '1px solid',
              borderColor: 'divider',
              mb: 0.5,
              borderRadius: '4px !important',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 44 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {item.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

    </Box>
  )
}

export default Sobre
