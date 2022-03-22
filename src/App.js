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


console.log("members:")
console.log(politicians_objects.length)


// convert JSON objects to React objects
const politicians = politicians_objects.map(
  politicians_objects => (
    {label: politicians_objects.name, wiki_id: 
      politicians_objects.wiki_id
    })
  )


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


  
 
function BasicCard(props) {

  console.log(props.data.image)
  
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
      other_ent_image: rels.other_ent_image,
      other_ent_name: rels.other_ent_name,
    }
    ))

  return relations.map((entry) => (
    <Grid item md={1}>
      <Card variant="outlined" sx={{ minWidth: 275 }}>
        <CardContent>        
          <Typography variant="body2">          
            {entry.date}
          </Typography>
        </CardContent>
        <CardContent>

          <Grid container spacing={2}>
            <Grid item xs={6}>
            <Avatar alt={entry.focus_ent} src={entry.main_ent_image} sx={{ width: 76, height: 76 }}/>
            </Grid>
            <Grid item xs={6}>
            <Avatar alt={entry.other_ent_name} src={entry.other_ent_image} sx={{ width: 76, height: 76 }}/>
            </Grid>
          </Grid>
        
        </CardContent>
        <CardContent>
          <Typography variant="body2">          
            {entry.title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))
}


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


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

// present a person card/info + news titles
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
            <Avatar alt={props.data.name} src={props.data.image} sx={{ width: 160, height: 160 }}/>
            <Typography variant="h6" component="div">
              <b>{props.data.name}</b>
            </Typography>
            <Link href={wiki_url} target="_blank" >
              <SiWikidata size={35}/>
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
                  <img key="{member.name}" width="68" src={member.image_url}></img>
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
        <HiAcademicCap size={35}/>
        {(!props.data || !props.data.education)
          ? (<p>Loading...</p>) 
          : (FillIn(props.data.education)
          )}
        </Grid>

      </Grid>
          
      <Grid
        container
        spacing={1} 
        columns={1}
        direction='row'
        alignItems="left"
        justifyContent="center"
        width={500}
      >
      
      <FormGroup>
        <FormControlLabel control={<Switch defaultChecked />} label="all" />
      </FormGroup>

      <br></br>

    
    {(!props.data || !props.data.occupations) 
          ? (<p>Loading...</p>) 
          : <BasicCard data={props.data}/>
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
