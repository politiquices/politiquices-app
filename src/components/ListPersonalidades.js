import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Link from '@material-ui/core/Link';
import { Typography } from '@mui/material';
import { Button, CardMedia, CardActionArea, CardActions } from '@mui/material';

const gridStyles = {
  backgroundColor: "white",
  marginTop: 1,
  // marginLeft: "auto",
  // marginRight: "auto",
};

//paddingBottom: 10,
//paddingRight: 10,
//
//maxWidth: 100


function ListPersonalidades(personalities) {

    const headlines = personalities.data.map(raw_data => (
        {          
          label: raw_data.name,
          nr_articles: raw_data.nr_articles,
          url_image: raw_data.image_url,
          wikidata_url: raw_data.wikidata_url,
          wiki_id: raw_data.wiki_id

        }))
  
      return headlines.map((entry) => (
  
        <Grid item width={250} align="center">
          <Link justify="center" href={`personalidade/${entry.wiki_id}`}>
            <Avatar alt={entry.focus_ent} src={entry.url_image} sx={{ width: 125, height: 125 }}/>{entry.label}
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
      <Grid container direction="row" spacing={6} columns={{ xs: 12, sm: 12, md: 4 }} justifyContent="space-evenly"
            style={gridStyles}>
        {data && <ListPersonalidades data={data} />}
        {isError && <div>Error fetching data.</div>}
      </Grid>
  );
};

export default FetchPersonalidades;