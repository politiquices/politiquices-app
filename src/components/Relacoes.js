import React from 'react'
import Select from 'react-select'       // https://react-select.com/home
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import NewsTitles from './utils/NewsTitles'
import RangeSlider from './utils/DateSlider'
import politicians_objects from '../json/persons.json';
// see: https://dirask.com/posts/React-button-with-AJAX-request-1XokYj

// convert JSON objects to React objects
const politicians = politicians_objects.map(
  politicians_objects => (
    {
      label: politicians_objects.name, 
      value: politicians_objects.wiki_id
    })
  )

var state = {
    selectedOption: null,
}

var only_among_selected =  true
var only_sentiment = true

const Relacoes = () => {

  const [response, setResponse] = React.useState();
  const [selectedOption, setSelectedOption] = React.useState();
    
  const handleClick = async () => {

        // see: https://www.pluralsight.com/guides/how-to-send-data-via-ajax-in-react

        let result = state.map(a => a.value);

        let params = ''
        for (let i=0; i< result.length; i++) {
          params += '&q='+result[i]
        }

        params += '&selected='+only_among_selected
        params += '&sentiment='+only_sentiment
        
        fetch(`http://127.0.0.1:8000/timeline/?${params}`, {
          method: "GET",
          headers: {'Content-Type': 'application/json'}})
          .then(res => res.json())
            .then(data => {
              console.log(data)
              setResponse(data);
            })
          .catch(err => {
              console.log(err)
          });
        
        console.log("state: ", state)
        setSelectedOption(state);

    };
   
  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e);
    state = e
    console.log(`selected:`, e);
  }
    
  const MyComponent = () => (
      <Select 
        class="centered" 
        isMulti={true} 
        value={selectedOption}
        onChange={handleChange}
        options={politicians}
        />
  )

  const handleChangeRelationships = (e) => {
    only_sentiment = e.target.checked
  }

  const handleChangePersons = (e) => {
    only_among_selected = e.target.checked
  }

  return (
    <React.Fragment>
        { /* personalities to select */}        
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} sx={{ paddingTop: 2 }}><MyComponent/></Grid>
          <Grid item xs={4}></Grid>
        </Grid>        
        
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}><center><RangeSlider/></center></Grid>
        </Grid>

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={2}><Switch defaultChecked onChange={handleChangePersons}/>Apenas entre seleccionados</Grid>
          <Grid item xs={2}><Switch defaultChecked onChange={handleChangeRelationships}/>Apenas apoio/oposição</Grid>
          <Grid item xs={4}></Grid>
        </Grid>        

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} sx={{ paddingBottom: 2 }}>
            <center>
              <Button variant="contained" onClick={() => { handleClick(); }}>Actualizar</Button>
            </center>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        

      { /* news titles */}
      <Grid container 
      direction="row" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="space-evenly">
      {(!response) 
        ? (<p></p>) 
        : <NewsTitles data={response}/>
      }
      </Grid>
    </React.Fragment>
  )
}
  
export default Relacoes;