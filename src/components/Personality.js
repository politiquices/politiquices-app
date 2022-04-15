import './App.css';
import React, { useEffect, useState, Component} from 'react'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Link from '@material-ui/core/Link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import politicians_objects from '../json/persons.json';
import { Switch } from '@mui/material';

import { SiWikidata } from "react-icons/si";
import { HiAcademicCap } from "react-icons/hi";

import PublicoLogo from "./images/114px-Logo_publico.png"
import ArquivoLogo from "./images/color_vertical.png"

export const MContext = React.createContext();  //exporting context object

/*
class MyProvider extends Component {
  state = {
    message: "",
    selectedPerson: {}
  }
  render() {
      return (
          <MContext.Provider value={
            {
              state: this.state, 
              setMessage: (value) => this.setState({message: value }),
              setSelectedPerson: (value) => this.setState({selectedPerson: value })
            }
            }
          >
          {this.props.children}   {// this indicates that all the child tags with MyProvider as Parent can access the global store.} 
          </MContext.Provider>)
  }
}
*/


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
  } else {
    var rels = props.data.raw_relationships.supported_by
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
              <Link href="#"> {/* onClick=setSelectedPerson(entry.other_ent_url) */}
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

  const wiki_url = "http://www.wikidata.org/wiki/"+props.data.wiki_id

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


function App() {

  const [selectedPerson, setSelectedPerson] = useState({})
  const [data, setData] = useState()
  
  // this function uses the 'setData' defined in App() - received in props.func() 
  // which triggers automatically changes in the DOM done together with Tiago Viegas
  function auxFun(selected_person) {
    console.log('triggered')
    fetch('http://localhost:3000/entity_raw?q='+selected_person.wiki_id).then(
      response => response.json()).then(
          x => setData(x)
      )
  }

  if (!data || !data.occupations) {
    return (
      <div>
        <br></br>
        <center>
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
        </center>
      </div>
    )
  }
  
  else {
      return (
        <div>
          <br></br>
          <center>
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
          </center>
          <br></br>
          <div id="personality">        
            <center>
              <PersonalidadeInfo data={data} />
              </center>
          </div>
        </div>
      )
    }   
}

export default App;





/*
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
*/

