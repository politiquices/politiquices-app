import React, { useEffect, useState} from 'react'
import './App.css';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LanguageIcon from '@mui/icons-material/Language';
import Link from '@material-ui/core/Link';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import politicians_objects from './persons.json';


// convert JSON objects to React objects
const politicians = politicians_objects.map(
  politicians_objects => (
    {label: politicians_objects.name, wiki_id: 
      politicians_objects.wiki_id
    })
  )

  
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
  
function BasicCard(props) {

  const test = props.data.other  
  const relationships = test.map(
    test => ({title: test.title, url: test.url})
    )

  console.log(relationships)

  return relationships.map((member) => (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>        
        <Typography variant="body2">          
          {member.title}
        </Typography>
      </CardContent>
    </Card>
  ))
}




function FillIn(occupations) {
  if (occupations.length > 0) {
    return occupations.map((member) => (
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {member}
      </Typography>
    ))              
  }
  return <Typography sx={{ mb: 1.5 }} color="text.secondary">-</Typography>
}

// present a person card/info
function ColumnsGrid(props) {

  const wiki_url = "http://www.wikidata.org/wiki/"+props.data.wiki_id

  // console.log(props.data.raw_relationships)

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
            <Avatar alt={props.data.name} src={props.data.image} sx={{ width: 124, height: 124 }}/>
            <Typography variant="h6" component="div">
              <b>{props.data.name}</b>
            </Typography>
            <Link href={wiki_url} target="_blank" >
              <LanguageIcon/>
            </Link>
          </center>
        </Grid>

        {/* Partido Político */} 
        <Grid item xs={4}>
          <center>
            {(!props.data || !props.data.parties) ? (
            <p>Loading...</p>
            ) : (
              props.data.parties.map((member, i) => (
                <div>
                  <img key="{member.name}" width="48" src={member.image_url}></img>
                  <br/>
                </div>
              ))
          )}

          </center>
        </Grid>

        {/* Profissão */} 
        <Grid item xs={4}>      
        {(!props.data || !props.data.occupations) 
          ? (<p>Loading...</p>) 
          : (FillIn(props.data.occupations)                
        )}
        </Grid>

        {/* Estudos */} 
        <Grid item xs={4}>
        {(!props.data || !props.data.education)
          ? (<p>Loading...</p>) 
          : (FillIn(props.data.education)
          )}
        </Grid>

      </Grid>
    

      <Grid 
        container 
        spacing={1} 
        columns={32}
        alignItems="center"
        justifyContent="center"
      >
    
    {(!props.data || !props.data.occupations) 
          ? (<p>Loading...</p>) 
          : <BasicCard data={props.data.raw_relationships}/>
        }
    
      </Grid>

    </Box>
  );
}


function ComboBox(props) {

  const [selectedPerson, setSelectedPerson] = useState({})

  // this function uses the 'setData' defined in App() - received in props.func() 
  // which triggers automatically changes in the DOM done together with Tiago Viegas
  function auxFun(selected_person) {
    fetch('http://localhost:3000/entity_raw?q='+selected_person.wiki_id).then(
      response => response.json()).then(
          x => props.func(x)
      )
  }

  return (
    <div>
      <Autocomplete
        
        id="combo-box-demo"
        options={politicians}
        sx={{ width: 300 }}
        onChange={(event, value) => {
          setSelectedPerson(value)
          auxFun(value)
        }} 
        renderInput={(params) => <TextField {...params} label="Personalidade" />}
      />
    </div>
  );
}


function App() {
  
  const [data, setData] = useState({})

  useEffect(() => {
    fetch('http://localhost:3000/entity_raw?q=Q1442096').then(
      response => response.json()
    ).then(
      data => {
        setData(data)
        if (!data) {
          debugger
        }}
    )
  }, [])

  return (
    <div>
        <center>
          <ComboBox func={setData}/>
        </center>
      <br></br>
      <div id="personality">
        <center>
          <ColumnsGrid data={data} />
          </center>
      </div>
    </div>
  );
}

export default App;
