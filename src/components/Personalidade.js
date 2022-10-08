import Link from '@material-ui/core/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { SiWikidata } from "react-icons/si";
import { HiAcademicCap } from "react-icons/hi";
import { useParams } from 'react-router-dom';
import React, { useState} from 'react'


// Loads person card/info + news titles
function PersonalidadeInfo(data)  {
    
    function FillIn(occupations) {
      if (occupations.length > 0) {
        return occupations.map((member) => (
          <Link href="#">
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {member}
            </Typography>
          </Link>
        ))              
      }
      return <Typography sx={{ mb: 1.5 }} color="text.secondary">-</Typography>
    }
    
    console.log("before")
    console.log(data)

    if (!data.name) {
        (<p>Loading...</p>)   
    }
    else {

        console.log("loaded")

        const wiki_url = "http://www.wikidata.org/wiki/"+data.wiki_id

        return (
            <Box sx={{ flexGrow: 1 }}>
            <Grid 
                container 
                spacing={1} 
                columns={32}
                alignItems="center"
                justifyContent="center"
            >
                
                {/* Foto + Nome + WikiData link */} 
                <Grid item xs={4}>
                <center>
                    <Avatar alt={data.name} src={data.image} sx={{ width: 160, height: 160 }}/>
                    <Typography variant="h6" component="div">
                    <b>{data.name}</b>
                    </Typography>
                    <Link href={wiki_url} target="_blank" >
                    <SiWikidata size={35}/>
                    </Link>
                </center>
                </Grid>
        
                {/* Partido(s) Político(s) */} 
                <Grid item xs={4}>
                <center>
                    {(!data || !data.parties) ? (
                    <p>Loading...</p>
                    ) : (              
                    data.parties.map((member, i) => (
                        <Link href="#">
                        <div>
                        <img key="{member.name}" width="68" src={member.image_url}></img>
                        <br/>
                        </div>
                        </Link>              
                    ))
                )}
        
                </center>
                </Grid>
        
                {/* Profissão/ões */} 
                <Grid item xs={4}>      
                {(!data || !data.occupations) 
                ? (<p>Loading...</p>) 
                : (FillIn(data.occupations)                
                )}
                </Grid>
        
                {/* Estudos */}         
                <Grid item xs={4}>
                <HiAcademicCap size={35}/>
                {(!data || !data.education)
                ? (<p>Loading...</p>) 
                : (FillIn(data.education)
                )}
                </Grid>
        
            </Grid>    
            </Box>
            );
        }
  }

const Teste = () =>  {

    const [data, setData] = useState();
    const { id } = useParams();
    console.log(id);
    
    fetch(`http://127.0.0.1:8000/personality/${id}`)
        .then(res => res.json())
        .then(response => {
          console.log(response)
          setData(response);
      });

    return (
        <div>
            (!data)
            ? (<p>Loading...</p>)
            : <PersonalidadeInfo data={data}/>
        </div>
    )
}

export default Teste;