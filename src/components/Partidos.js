import React, { useEffect, useState} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@mui/material/Typography';

function Partido(parties) {            
                
    const partidos = parties.data.map(party => (
        {
          // country: party.country.value, 
          nr_members: party.nr_personalities,
          label: party.party_label,
          logo: party.party_logo,     
          wiki_id: party.wiki_id,
        }))
    
    console.log(partidos)
    
    return partidos.map((entry) => (
        <React.Fragment>
            <Link>
                <Card sx={{ maxWidth: 180 }} className="card">
                    <center>
                    <CardMedia style={{width: "auto"}}
                        align='center'
                        component="img"
                        height="50"
                        image={entry.logo}
                        alt={entry.label}
                    />
                    </center>
                    
                <CardContent>
                    <Typography gutterBottom variant="h7" component="div" align='center'>{entry.label}</Typography>
                    <Typography variant="body2" color="text.secondary" align='center'>{entry.nr_members}</Typography>                    
                </CardContent>
                </Card>
                </Link>
        </React.Fragment>        
    ))
}



const Partidos = () => {
    
    const [data, setData] = useState([])

    useEffect(() => {
      fetch('http://127.0.0.1:8000/parties/').then(
        response => response.json()
      ).then( data => { 
            setData(data) 
        })
    }, [])

    if (data.length === 0) {
        return (
            <div className="row">Nothing loaded</div>
        )        
    }

    else {
        return (
            <React.Fragment>
                <Grid container direction="row" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="space-evenly">
                    {(!data) 
                    ? (<p></p>) 
                    : <Partido data={data}/>
                    }
                </Grid>
            </React.Fragment>
          );
        }
    }
    
export default Partidos;