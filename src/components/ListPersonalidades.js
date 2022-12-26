import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Link from '@material-ui/core/Link';
import { Typography } from '@mui/material';

function ListPersonalidades(personalities) {

    const headlines = personalities.data.map(raw_data => (
        {          
          label: raw_data.name,
          nr_articles: raw_data.nr_articles,
          url_image: raw_data.image_url,
          local_image: raw_data.local_image,
          wiki_id: raw_data.wiki_id

        }))
  
      return headlines.map((entry) => (
  
        <Grid item key={entry.wiki_id} width={250} align="center" columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
          <Link justify="center" href={`personalidade/${entry.wiki_id}`}>
            <Avatar alt={entry.focus_ent} src={entry.local_image} sx={{ width: 125, height: 125 }}/>{entry.label}
          </Link>               
          <Typography justify="center" fontSize={2}>{entry.nr_articles} notícias</Typography>
        </Grid>
      ))
}

const FetchPersonalidades = () => {

  const [data, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchData = () => {
      fetch(`http://127.0.0.1:8000/personalities/`)
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

      <Grid container direction="row" spacing={6} justifyContent="space-evenly">  {/* style={gridStyles}> */}
        {data && <ListPersonalidades data={data} />}
        {isError && <div>Error fetching data.</div>}
      </Grid>
  );
};

export default FetchPersonalidades;