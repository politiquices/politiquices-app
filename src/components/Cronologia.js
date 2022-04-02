import React, { useEffect, useState, Component} from 'react'
import Select from 'react-select'
import politicians_objects from '../json/persons.json';
//import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';

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

        console.log(state);
        
        let result = state.map(a => 'wd:'+a.value);
        const recipeUrl = 'http://127.0.0.1:5000/timeline';
        const postBody = result

        const requestMetadata = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        };

        fetch(recipeUrl, requestMetadata)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            //this.setState({ recipes });
        });
    };
   
  // handle onChange event of the dropdown
  const handleChange = (e) => {
    //this.setState({options: e});
    state = e
    console.log(`Option selected:`, e);
    console.log(state)
  }
    
    const MyComponent = () => (
      <Select  className="mt-4 col-md- col-offset-3"
        isMulti={true}
        options={politicians}
        onChange={handleChange}
        />
    )
    
    return (
      <div>
        <br></br>
        <center>
          <MyComponent/>
          <br></br>
          <Button 
            variant="contained"
            onClick={() => { handleClick(); }}
            // see: https://dirask.com/posts/React-button-with-AJAX-request-1XokYj
          >  
            Cronologia
          </Button>
          {response && <div>{response}</div>}
        </center> 
      </div>
    )
  }
  
export default Cronologia;