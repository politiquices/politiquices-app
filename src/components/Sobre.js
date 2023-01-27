import Typography from '@mui/material/Typography'

function Sobre() {
  return (
    <>
      <Typography align="center" sx={{ paddingTop: 10 }}>
        Dados extraídos com a API do Arquivo.PT a 2023-01-02
      </Typography>
      <Typography align="center">Grafo RDF gerado a 2023-01-02</Typography>
      <Typography sx={{ paddingTop: 10 }} align="center">
        Tech Stack
      </Typography>
      <Typography align="center">Apache Jena</Typography>
      <Typography align="center">React MUI</Typography>
    </>
  )
}

export default Sobre
