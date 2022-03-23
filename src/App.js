import React, { useEffect, useState} from 'react'
import './App.css';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Link from '@material-ui/core/Link';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import politicians_objects from './json/persons.json';
import { Switch } from '@mui/material';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { SiWikidata } from "react-icons/si";
import { HiAcademicCap } from "react-icons/hi";

import PublicoLogo from "./images/114px-Logo_publico.png"
import ArquivoLogo from "./images/color_vertical.png"


//const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// convert JSON objects to React objects
const politicians = politicians_objects.map(
  politicians_objects => (
    {label: politicians_objects.name, wiki_id: 
      politicians_objects.wiki_id
    })
  )

// Loads news titles for a given personality
function NewsTitles(props) {
  
  if (props.data.raw_relationships.opposes) {
    console.log("selected opposes")
    var rels = props.data.raw_relationships.opposes

  } else if (props.data.raw_relationships.supports) {
    console.log("selected supports")
    var rels = props.data.raw_relationships.supports
  
  } else if (props.data.raw_relationships.opposed_by) {
    console.log("selected opposed_by")
    var rels = props.data.raw_relationships.opposed_by
  
  } else if (props.data.raw_relationships.supported_by) {
    console.log("selected supported_by")
    var rels = props.data.raw_relationships.supported_by
  
  } else {
    console.log("selected None")
  }
  
  const relations = rels.map(rels => (
    {
      title: rels.title, 
      url: rels.url, 
      date: rels.date,      
      main_ent_image: props.data.image,
      rel_type: rels.rel_type,
      other_ent_image: rels.other_ent_image,
      other_ent_name: rels.other_ent_name,
      other_ent_url: rels.other_ent_url
    }
    ))

  return relations.map((entry) => (
    <Grid item md={1}>
      <Card variant="outlined" sx={{ minWidth: 275 }}>
        <CardContent>        
          <Typography variant="h6" component="div">          
            {entry.date}
          </Typography>
        </CardContent>
        <CardContent>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Avatar alt={entry.focus_ent} src={entry.main_ent_image} sx={{ width: 76, height: 76 }}/>
            </Grid>
            <Grid item xs={4}>
              {entry.rel_type}
            </Grid>
            <Grid item xs={4}>
              <Link href={entry.other_ent_url} onClick={console.log(entry.other_ent_url)}>
                <Avatar alt={entry.other_ent_name} src={entry.other_ent_image} sx={{ width: 76, height: 76 }}/>
              </Link>
            </Grid>
          </Grid>
        
        </CardContent>
        <CardContent>          
            <Typography variant="h10">          
              {entry.title}              
            </Typography>

            <Link href={entry.url} target="_blank"><img width="25" src={PublicoLogo}/></Link>                               
        </CardContent>
      </Card>
    </Grid>
  ))
}

// Loads person card/info + news titles
function PersonalidadeInfo(props) {

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
  

  const wiki_url = "http://www.wikidata.org/wiki/"+props.data.wiki_id

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
            <Avatar alt={props.data.name} src={props.data.image} sx={{ width: 160, height: 160 }}/>
            <Typography variant="h6" component="div">
              <b>{props.data.name}</b>
            </Typography>
            <Link href={wiki_url} target="_blank" >
              <SiWikidata size={35}/>
            </Link>
          </center>
        </Grid>

        {/* Partido(s) Político(s) */} 
        <Grid item xs={4}>
          <center>
            {(!props.data || !props.data.parties) ? (
            <p>Loading...</p>
            ) : (              
              props.data.parties.map((member, i) => (
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
        {(!props.data || !props.data.occupations) 
          ? (<p>Loading...</p>) 
          : (FillIn(props.data.occupations)                
        )}
        </Grid>

        {/* Estudos */}         
        <Grid item xs={4}>
        <HiAcademicCap size={35}/>
        {(!props.data || !props.data.education)
          ? (<p>Loading...</p>) 
          : (FillIn(props.data.education)
          )}
        </Grid>

      </Grid>
      
      {/* Títulos de Notícias */}
      <Grid
        container
        spacing={2} 
        columns={1}
        direction='row'
        alignItems="left"
        justifyContent="center"
        width={650}
      >
      
      <FormGroup>
        <FormControlLabel control={<Switch defaultChecked />} label="all" />
      </FormGroup>

      <br></br>
    
      {(!props.data || !props.data.raw_relationships) 
        ? (<p>Loading...</p>) 
        : <NewsTitles data={props.data}/>
      }    
      </Grid>

    </Box>
  );
}

// Autocomplete with all personalities
function Personalidades(props) {

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
          <Personalidades func={setData}/>
        </center>
      <br></br>
      <div id="personality">        
        <center>
          <PersonalidadeInfo data={data} />
          </center>
      </div>
    </div>
  );
}

export default App;
