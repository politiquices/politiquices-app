import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

function Home() {
  return (
    <Typography component="div" sx={{ paddingTop: 10 }}>
      <Box sx={{ textAlign: 'center', m: 1 }}>
      O politiquices.pt permite pesquisar relações de apoio ou oposição entre personalidades e partidos 
      políticos expressas em títulos de notícias.
      <List sx={{ listStyleType: 'disc'}}>
        <ListItem >Que acusações fez Passos Coelho a José Sócrates?</ListItem>
        <ListItem>Quem do PS se opôs/apoiou a José Sócrates?</ListItem>
        <ListItem>Que personalidades do BE se opuseram a Jerónimo de Sousa?</ListItem>
        <ListItem>Que personalidades afiliadas ao BE se opuseram a personalidades do PCP?</ListItem>
        <ListItem>Que personalidades do PS apoiaram/se opuseram a outras personalidades do PS?</ListItem>
      </List>
      </Box>
    </Typography>
  );  
}

export default Home
