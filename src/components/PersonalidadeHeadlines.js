import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@material-ui/core/Link';

// https://blog.openreplay.com/data-fetching-techniques-with-react

const gridStyles = {
  backgroundColor: "white",
  marginTop: 1,
  marginLeft: "148",
  marginRight: "158",
};

function PersonalidadeHeadlines(titles) {

  /*
    url: raw_data.url,
    focus_ent
    other_ent_name
    other_ent_url
    rel_type
    score
    title
  */
 
  if (titles.data) { 

    console.log(titles)
    
    return titles.data.map((item, index) => (

      <Grid item key={index} align="center">
        <Typography justify="center">{item.date}</Typography>
        <Link href={item.url} target="_blank">
          <Typography justify="center">{item.title}</Typography>
        </Link>
        
      </Grid>
    ))
  
  }
  
  else {
    
    return (
      <div>
        Loading...
      </div>
    )

  }
}

const FetchPersonalidadeHeadlines = () => {

  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchData = () => {
      fetch(`http://localhost:8000/personality/relationships/${id}`)
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
    <Grid container direction="row" spacing={6} justifyContent="space-evenly" style={gridStyles}>
      {notes && <PersonalidadeHeadlines data={notes['opposes']} />}
      {isError && <div>Error fetching data.</div>}
    </Grid>

  );
};

export default FetchPersonalidadeHeadlines;