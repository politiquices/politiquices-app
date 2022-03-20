import React, { useEffect, useState, Component} from 'react'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const politicians = [
  { label: 'Francisco Louçã', wiki_id: 'Q1442096' },
  { label: 'José Sócrates', wiki_id: 'Q182367' },
  { label: 'Durão Barroso', wiki_id: 'Q15849' },
  { label: 'André Ventura', wiki_id: 'Q69935603' },
  { label: 'Cavaco Silva', wiki_id: 'Q57398' },
];


function ColumnsGrid(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
    
      <Grid container spacing={1} columns={32}>

        <Grid item xs={4}>
          <center>
            <Avatar alt={props.data.name} src={props.data.image} sx={{ width: 124, height: 124 }}/>
            <Typography variant="h6" component="div">
              <b>{props.data.name}</b>
            </Typography>
          </center>
        </Grid>

        <Grid item xs={4}>
          <center>
            {(!props.data || !props.data.parties) ? (
            <p>Loading...</p>
            ) : (
              props.data.parties.map((member, i) => (
                <div>
                  <img key="{member.name}" width="48" src={member.image_url}></img>
                  <br/>
                </div>
              ))
          )}

          </center>
        </Grid>

        <Grid item xs={4}>
        
        {(!props.data || !props.data.occupations) ? (
            <p>Loading...</p>
            ) : (
              props.data.occupations.map((member, i) => (
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {member}
                </Typography>
              ))
          )}
        </Grid>

        <Grid item xs={4}>
        {(!props.data || !props.data.education) ? (
            <p>Loading...</p>
            ) : (
              props.data.education.map((member, i) => (
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {member}
                </Typography>
              ))
          )}
        </Grid>

        
      </Grid>
    
    </Box>
  );
}


function ComboBox(props) {

  const [selectedPerson, setSelectedPerson] = useState({})

  function auxFun(selected_person) {
    fetch('http://localhost:5000/entity_raw?q='+selected_person.wiki_id).then(
      response => response.json()).then(
          x => props.func(x)
      )
  }


  return (
    <div>
      <Autocomplete
        disablePortal
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
    fetch('http://localhost:5000/entity_raw?q=Q1442096').then(
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
