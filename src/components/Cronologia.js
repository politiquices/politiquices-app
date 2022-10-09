import React from 'react'
import Select from 'react-select'
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

const Cronologia = () => {

  const [response, setResponse] = React.useState();
    
  const handleClick = async () => {

        // see: https://www.pluralsight.com/guides/how-to-send-data-via-ajax-in-react

        let result = state.map(a => a.value);

        let params = ''
        for (let i=0; i< result.length; i++) {
          params += '&q='+result[i]
        }

        console.log(`/timeline/?${params}`)
        
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

    };
   
  // handle onChange event of the dropdown
  const handleChange = (e) => {
    //this.setState({options: e});
    state = e
    console.log(`selected:`, e);
  }
    
  const MyComponent = () => (
      <Select class="centered" isMulti={true} options={politicians} onChange={handleChange}/>
  )

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
          <Grid item xs={2}><center><RangeSlider/></center></Grid>
          <Grid item xs={2}>Todas<Switch defaultChecked />Entre Seleccionados</Grid>
          <Grid item xs={4}></Grid>
        </Grid>        

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} sx={{ paddingBottom: 2 }}><center><Button variant="contained" onClick={() => { handleClick(); }}> Actualizar </Button></center></Grid>
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
  
export default Cronologia;