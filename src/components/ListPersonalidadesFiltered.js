import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Link from '@material-ui/core/Link';
import { Typography } from '@mui/material';

/*
const gridStyles = {
  backgroundColor: "white",
  marginTop: 1,
  marginLeft: "148",
  marginRight: "158",
};
*/

//paddingBottom: 10,
//paddingRight: 10,
//maxWidth: 100


function ListPersonalidadesFiltered(personalities) {

    const headlines = personalities.data.map(raw_data => (
        { 
          wiki_id: raw_data.ent1.value.split("/").at(-1),
          label: raw_data.ent1_name.value,
          url_image: raw_data.image_url.value,
          nr_articles: 0,
        }))
  
    // to remove the last part of the current URL
    var full_url = window.location.href
    var base_url = full_url.replace(window.location.pathname, '');
    
    return headlines.map((entry) => (
      
      <Grid item key={entry.wiki_id} width={250} align="center" columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
        <Link justify="center" href={base_url + '/personalidade/' + entry.wiki_id}>
          <Avatar alt={'test'} src={entry.url_image} sx={{ width: 125, height: 125 }}/>{entry.label}
        </Link>               
        <Typography justify="center" fontSize={2}>{entry.nr_articles} notícias</Typography>
      </Grid>
    ))
}

const FetchPersonalidades = (type) => {

  const base_url = 'http://127.0.0.1:8000'
  const { id } = useParams();
  var full_url = ''

  console.log(type.type)

  switch(type.type) {
    case 'education':
      full_url = base_url+'/personalities/educated_at/'+id
      break;

    case 'occupation':
      full_url = base_url+'/personalities/occupation/'+id
      break;
    
    case 'government':  
      full_url = base_url+'/personalities/government/'+id
      break;

    case 'assembly':  
      full_url = base_url+'/personalities/assembly/'+id
      break;

    case 'public_office':
      full_url = base_url+'/personalities/public_office/'+id
      break;

    case 'party':
      full_url = base_url+'/personalities/party/'+id
      break;
  
    default:
      console.log('ERROR')
}


  const [data, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchData = () => {
      fetch(full_url)
      .then((response) => response.json())
      .then((data) => {
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
  return (

      // xs, sm, md, lg, xl
      // xs - default
      // sm - min width 600px
      // md - min width 960px
      // lg - min width 1280px
      // xl - min width 1920px

      <Grid container direction="row" spacing={6} justifyContent="space-evenly"> { /* style={gridStyles}> */ }
        {data && <ListPersonalidadesFiltered data={data} />}
        {isError && <div>Error fetching data.</div>}
      </Grid>
  );
};

export default FetchPersonalidades;