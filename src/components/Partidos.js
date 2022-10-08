import React, { useEffect, useState} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from '@material-ui/core/Link';
import GridSystem from './utils/GridSystem';

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
        
        // display parties in the Grid
        const Item = props => {
            // destructure the props
            const { label, logo, nr_members, country} = props
            return (
                <React.Fragment>
                    <Link>
                    <Card sx={{ maxWidth: 180 }} className="card">
                        <center>
                        <CardMedia style={{width: "auto"}}
                            align='center'
                            component="img"
                            height="50"
                            image={logo}
                            alt={label}
                        />
                        </center>
                    
                    <CardContent>
                        <Typography gutterBottom variant="h7" component="div" align='center'>
                        {label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='center'>
                        {nr_members} personalidades
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='center'>
                        {country} 
                        </Typography>
                    </CardContent>
                    </Card>
                    </Link>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                {/* ToDo: review the code for GridSystem */}
                <GridSystem>
                    {/* Mapping every element to an <Item /> and pass props, returning an array of JSX that the grid system will take as children.*/}
                    { data.length > 0 
                    ? data.map(item => <Item key={item.wiki_id} wiki_id={item.wiki_id} label={item.party_label} 
                                             logo={item.party_logo} nr_members={item.nr_personalities} country={item.country}/>) 
                    : [<p>Não foram encontrados partidos</p>] }
                </GridSystem>
            </React.Fragment>
          );
        }
    }
    
export default Partidos;