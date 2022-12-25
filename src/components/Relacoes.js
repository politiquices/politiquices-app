import React, { useState, useEffect } from 'react';
import Select from 'react-select'       // https://react-select.com/home
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import NewsTitles from './utils/NewsTitles'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
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
var min = 2014
var max = 2022

function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress/>
    </Box>
  );
};

const Relacoes = () => {

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [value, setValue] = useState([2000, 2014]);
  
  
  const handleClick = async () => {

        // see: https://www.pluralsight.com/guides/how-to-send-data-via-ajax-in-react

        let result = state.map(a => a.value);

        let params = ''
        for (let i=0; i< result.length; i++) {
          params += '&q='+result[i]
        }

        params += '&selected='+only_among_selected
        params += '&sentiment='+only_sentiment
        params += '&start='+min
        params += '&end='+max

        setLoading(true);

        fetch(`http://127.0.0.1:8000/timeline/?${params}`, {
          method: "GET",
          headers: {'Content-Type': 'application/json'}})
          .then(res => res.json())
            .then(data => {
              setResponse(data);
              setLoading(false);
            })
          .catch(err => {
            setLoading(false);
            console.log(err)
          });
        setSelectedOption(state);
    };

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e);
    state = e
    console.log(`selected:`, e);
  }
    
  const handleChangeRelationships = (e) => {
    only_sentiment = e.target.checked
    console.log(only_sentiment)
  }

  const handleChangePersons = (e) => {
    only_among_selected = e.target.checked
    console.log(only_among_selected)
  }

  const handleChangeYears = (event, newValue) => {
    setValue(newValue);
    min = newValue[0]
    max = newValue[1]
  }

  const Politicians = () => (
    <Select 
      class="centered"
      isMulti={true} 
      value={selectedOption}
      onChange={handleChange}
      options={politicians}
      />
)

  return (
    <React.Fragment>
      {loading ? (
          <CircularIndeterminate/>
        ) : 
        (
          <React.Fragment>
          
          { /* select personality */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} sx={{ paddingTop: 2 }}><Politicians/></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          
          { /* dates interval */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <center>
              <Box sx={{ width: 300 }}>
                <Slider
                  getAriaLabel={() => 'Intervalo Datas'}
                  value={value}
                  onChange={handleChangeYears}
                  valueLabelDisplay="auto"
                  min={1994}
                  max={2022}
                />
              </Box>
              </center>
            </Grid>
          </Grid>

          { /* switch buttons */}
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}><Switch defaultChecked onChange={handleChangePersons}/>Apenas entre seleccionados</Grid>
            <Grid item xs={2}><Switch defaultChecked onChange={handleChangeRelationships}/>Apenas apoio/oposição</Grid>
            <Grid item xs={4}></Grid>
          </Grid>

          { /* updated button */}
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
        <Grid container direction="row" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="space-evenly">
        {(!response) 
          ? (<p></p>) 
          : <NewsTitles data={response}/>
        }
        </Grid>
        </React.Fragment>
      )
    }
    </React.Fragment>
  )
}
  
export default Relacoes;