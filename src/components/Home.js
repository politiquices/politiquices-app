import React, { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import politicians_objects from '../json/persons.json';

// convert JSON objects to React objects
const politicians = politicians_objects.map(
  politicians_objects => (
    {label: politicians_objects.name, wiki_id: 
      politicians_objects.wiki_id
    })
  )

const Home = () => {

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // see: https://stackoverflow.com/questions/67124239/material-ui-how-to-show-autocomplete-dropdown-list-only-when-typing-something

    return (
      <center>
      <div style={{width:"15%", height:"10%", backgroundColor:"white"}}>
        <br></br>      
        <Autocomplete open={open} freeSolo="true" width="80%"
          onOpen={() => {
            // only open when in focus and inputValue is not empty
            if (inputValue) {
              setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onInputChange={(e, value, reason) => {
            setInputValue(value);

            // only open when inputValue is not empty after the user typed something
            if (!value) {
              setOpen(false);
            }
          }}
          options={politicians}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" />
          )}
      />
      </div>
      </center>
    );
  }
  
export default Home;