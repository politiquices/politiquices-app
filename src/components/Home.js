import React from "react"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Grid } from "@mui/material";
import politicians_objects from '../json/persons.json';

// convert JSON objects to React objects
const politicians = politicians_objects.map(
  politicians_objects => (
    {label: politicians_objects.name, wiki_id: 
      politicians_objects.wiki_id
    })
  )


const Home = () => {
    return (
      <div>
        <br></br>
        <center>
          <Grid container rowSpacing={123} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Autocomplete        
                id="combo-box-demo"
                options={politicians}
                sx={{ width: 300 }}
                onChange={(event, value) => {
                  //setSelectedPerson(value)
                  //auxFun(value)
                }} 
                renderInput={(params) => <TextField {...params} label="Personalidade" />}
              />          
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                  id="combo-box-demo"
                  options={politicians}
                  sx={{ width: 300 }}
                  onChange={(event, value) => {
                    //setSelectedPerson(value)
                    //auxFun(value)
                  }} 
                  renderInput={(params) => <TextField {...params} label="Personalidade" />}
                />
          </Grid>
        </Grid>
        </center>        
      </div>
    );
  }
  
export default Home;