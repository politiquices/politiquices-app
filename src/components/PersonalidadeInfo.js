import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { SiWikidata } from "react-icons/si";
import { HiAcademicCap } from "react-icons/hi";

// https://blog.openreplay.com/data-fetching-techniques-with-react

const gridStyles = {
  backgroundColor: "white",
  marginTop: 1,
  marginLeft: "148",
  marginRight: "158",
};


const PersonalidadeInfo = ({ data }) => {

  const wiki_url = "http://www.wikidata.org/wiki/"+data.wiki_id

  function FillIn(elements, url) {

    // to remove the last part of the current URL
    var full_url = window.location.href
    var base_url = full_url.replace(window.location.pathname, '');

    if (elements.length > 0) {
      return elements.map((item, index) => (
        <Link key={index} href={ base_url + '/' + url + '/' + item.wiki_id.split("/").at(-1)}>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {item.label}
          </Typography>
        </Link>
      ))              
    }
    return <Typography sx={{ mb: 1.5 }} color="text.secondary">-</Typography>
  }

  var base_url = window.location.href.replace(window.location.pathname, '')
  
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid 
            container 
            spacing={1} 
            columns={14}
            alignItems="center"
            justifyContent="center"
            style={gridStyles}
        >
            
            {/* Foto + Nome + WikiData link */} 
            <Grid item xs={2}>
            <center>
                <Avatar alt={data.name} src={data.image_url} sx={{ width: 160, height: 160 }}/>
                <Typography variant="h6" component="div">
                <b>{data.name}</b>
                </Typography>
                <Link href={wiki_url} target="_blank" >
                <SiWikidata size={35}/>
                </Link>
            </center>
            </Grid>
    
            {/* Partido(s) Político(s) */} 
            <Grid item xs={2}>
            <center>
                {(!data || !data.parties) ? (
                <p>Loading...</p>
                ) : (              
                data.parties.map((entry, index) => (
                    <Link href= {base_url + '/party/' + entry.wiki_id}>
                    <div>
                    <img key="{index}" width="68" src={entry.image_url}></img>
                    <br/>
                    </div>
                    </Link>              
                ))
            )}
    
            </center>
            </Grid>
    
            {/* Profissão(ões) */}
            <Grid item xs={2}>      
            {(!data || !data.occupations) 
            ? (<p>Loading...</p>) 
            : (FillIn(data.occupations, 'occupation')                
            )}
            </Grid>

            {/* Cargos públicos */}
            <Grid item xs={2}>      
            {(!data || !data.positions) 
            ? (<p>Loading...</p>) 
            : (FillIn(data.positions, 'public_office')                
            )}
            </Grid>

            {/* Legislaturas - governos de que fez parte */}
            <Grid item xs={2}>      
            {(!data || !data.governments) 
            ? (<p>Loading...</p>) 
            : (FillIn(data.governments, 'government')
            )}
            </Grid>

            {/* Assembleias de deputados de que fez parte */}
            <Grid item xs={2}>      
            {(!data || !data.assemblies) 
            ? (<p>Loading...</p>) 
            : (FillIn(data.assemblies, 'assembly')
            )}
            </Grid>
    
            {/* Estudos */}
            <Grid item xs={2}>
            <HiAcademicCap size={35}/>
            {(!data || !data.education)
            ? (<p>Loading...</p>) 
            : (FillIn(data.education, 'education')
            )}
            </Grid>    
        </Grid>    
      </Box>

    <Link href={"/personalidade_news/"+data.wiki_id}>
      <center>
        noticias
      </center>
    </Link>

    </div>
  );
};

const FetchPersonalidade = () => {

  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchData = () => {
      fetch(`http://127.0.0.1:8000/personality/${id}`)
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          setIsLoading(false);
          setNotes(data);
      })
      .catch((error) => {
          setIsLoading(false);
          setIsError(true);
          console.log(error);
      });
  };
  useEffect(() => {
      fetchData();
  }, []);
  if (isLoading) {
      return <div>Loading...</div>;
  }

  notes.wiki_id = id;

  return (
      <div>
      {notes && <PersonalidadeInfo data={notes}/>}
      {isError && <div>Error fetching data.</div>}
      </div>
  );
};

export default FetchPersonalidade;