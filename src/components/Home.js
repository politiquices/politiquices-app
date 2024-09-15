/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-no-useless-fragment */
import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography';

  function Home() {

    return (
      <React.Fragment>
      <Typography component="div" sx={{ paddingTop: 10 }}>
      <Box sx={{ textAlign: 'left', m: 1 }}>
      O politiquices.pt permite pesquisar relações de apoio ou oposição entre personalidades e partidos políticos
      expressas em títulos de notícias.
      <Typography component="div">
        <Box sx={{ textAlign: 'left', s: 1 }}>
        <ul>
          <li>Explorar as relações de forma bilateral a penas entre duas entidades (e.g.: políticos ou partidos)</li>
          <li>Explorar a rede de notícias envolvendo vários actores políticos através de relações de apoio ou 
            oposição</li>
        </ul>
        </Box>
        </Typography>
        </Box>
    </Typography>  
  </React.Fragment>
    )
  }

export default Home