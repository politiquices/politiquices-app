import { Typography, Box, List, ListItem, Link } from '@mui/material';

function Sobre() {
  return (
    <>
      <Box sx={{ paddingTop: 15 }}>
      <Typography variant="h5" align="center" sx={{ paddingBottom: 5 }}> O que é Politiquices.PT?</Typography>
        <Typography align="left">
          O Politiquices.PT foi desenvolvido no âmbito dos prémios Arquivo.PT 2021 cruzando dados do Arquivo.PT 
          com dados da Wikidata. Estes dados são disponibilizados através endpoint SPARQL, que é a 
          base de dados que alimenta a página web do Politiquices.PT.
        </Typography>
        </Box>
      <Box sx={{ paddingTop: 2 }}>
        <Typography align="left">
          É possível aceder ao directamente endpoint SPARQL do Politiquices.PT em: <Link href="http://sparql.politiquices.pt" target="_blank">http://sparql.politiquices.pt</Link>.
          Explore alguns dos exemplos de queries SPARQL <Link href="https://github.com/politiquices/SPARQL-endpoint/blob/main/tutorials/sparql_queries.md" target="_blank">aqui</Link>.
        </Typography>          
      </Box>

      <Box sx={{ paddingTop: 2 }}>
        <Typography align="left">
          Para uma explicação mais detalhada sobre o projeto veja o <Link href="https://www.youtube.com/watch?v=lfNS_F84N6k" target="_blank">vídeo</Link> de apresentação do projecto
          no âmbito dos seminários Café com Arquivo.PT 2022.
        </Typography>        
      </Box>

      {/* FAQ Section */}
      <Box sx={{ paddingTop: 10 }}>
        <Typography variant="h5" align="center" sx={{ paddingBottom: 0 }}> Perguntas Frequentes</Typography>
        <Typography align="left">
        <List>
          <ListItem>
            <Typography variant="h6">• Como são obtidos os dados do Politiquices?</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Os dados provêm do Arquivo.PT, um serviço que arquiva páginas da web e só disponibiliza as páginas 
              um ano após serem arquivadas.
            </Typography>
          </ListItem>

          <ListItem>
            <Typography variant="h6">• Quando é que os dados são atualizados?</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Os dados são atualizados anualmente, de acordo com as políticas de disponibilização do Arquivo.PT.
            </Typography>
          </ListItem>

          <ListItem>
            <Typography variant="h6">• O que é o Arquivo.PT?</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              O Arquivo.PT é um serviço público que preserva conteúdos da web portuguesa, permitindo 
              consultar versões antigas de sites.
            </Typography>
          </ListItem>
        </List>
        </Typography>
      </Box>
    </>
  );
}

export default Sobre;
