import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from '@material-ui/core/Link';
import CardContent from '@mui/material/CardContent';
import PublicoLogo from "../../images/publico_logo.png"
import ArquivoLogo from "../../images/arquivo_logo.png"
import Supports from "../../images/handshake.png"
import Opposes from "../../images/discrimination.png"
import Neutral from "../../images/conversation.png"

// Loads news titles for a given personality
function NewsTitles(props) {

    let raw_data = props.data

    function process(rel_type){
      if (rel_type.includes('opposes')) {return Opposes} 
      else if (rel_type.includes('supports')) {return Supports}
      return Neutral
    }

    const headlines = raw_data.map(raw_data => (
      {
        title: raw_data.title.value, 
        url: raw_data.arquivo_doc.value, 
        date: raw_data.date.value,     
        rel_type: raw_data.rel_type.value,
        rel_image: process(raw_data.rel_type.value),
        
        main_ent_image: raw_data.ent1_img.image_url,
        main_ent_name: raw_data.ent1_str.value,
        main_ent_url: raw_data.ent1.value.match(/Q\d+/g)[0],
        
        other_ent_image: raw_data.ent2_img.image_url,
        other_ent_name: raw_data.ent2_str.value,
        other_ent_url: raw_data.ent2.value.match(/Q\d+/g)[0]
      }))

    

    return headlines.map((entry) => (

      <Grid item md={4}>
        <Card variant="elevation" sx={{ minWidth: 15 }}>
          <CardContent>        
           
           {/* Date + Article Link */}
          <Grid container spacing={0.5}>
            <Grid item xs={3}></Grid>            
            <Grid item xs={3}><Typography variant="subtitle1" component="div" className="title-card" gutterBottom>{entry.date}</Typography></Grid>
            <Grid item xs={3}><Link href={entry.url} target="_blank"><img width="50" src={ArquivoLogo}/></Link></Grid>            
            <Grid item xs={3}></Grid>          
          </Grid>

          {/* Entities */}
          <Grid container spacing={1}>

            <Grid item xs={2}></Grid>

            <Grid item xs={3}>
              <Link href={`personalidade/${entry.main_ent_url}`} target="_blank">
                <Avatar alt={entry.focus_ent} src={entry.main_ent_image} sx={{ width: 66, height: 66 }}/>
              </Link>
            </Grid>

            <Grid item xs={2}>
              <Link target="_blank">
                {/* <Typography variant="h10">{entry.rel_type}</Typography> */}
                <img width="50" src={entry.rel_image}/>
              </Link>
            </Grid>

            <Grid item xs={3}>              
            <Link href={`personalidade/${entry.other_ent_url}`} target="_blank">
                <Avatar alt={entry.other_ent_name} src={entry.other_ent_image} sx={{ width: 66, height: 66 }}/>
            </Link>
            </Grid>

            <Grid item xs={2}></Grid>
          
          </Grid>

          {/* Title */}
          <Grid container spacing={1} sx={{ paddingTop: 2 }}>
            <Grid item xs={12}>            
              <Typography variant="h10" component="div" align='center' fontWeight="350">
                {entry.title}
              </Typography>
            </Grid>
          </Grid>
          </CardContent>
        </Card>
      </Grid>
    ))
  }

export default NewsTitles;