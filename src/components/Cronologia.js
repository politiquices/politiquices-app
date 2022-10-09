import React from 'react'
import Select from 'react-select'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import NewsTitles from './utils/NewsTitles'
import RangeSlider from './utils/DateSlider'
import politicians_objects from '../json/persons.json';


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
      <Select class="centered"
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
        <RangeSlider/>
        <br></br>
        <Button 
          variant="contained"
          onClick={() => { handleClick(); }}
          // see: https://dirask.com/posts/React-button-with-AJAX-request-1XokYj
        >  
          Cronologia
        </Button>
      </center> 
      <br></br>
      <center>
      <Grid
        container
        spacing={2} 
        columns={1}
        direction='row'
        alignItems="left"
        justifyContent="center"
        width={650}
      >
      {(!response) 
        ? (<p>Loading...</p>) 
        : <NewsTitles data={response}/>
      }
      </Grid>
      </center>

    </div>    
  )
}
  
export default Cronologia;