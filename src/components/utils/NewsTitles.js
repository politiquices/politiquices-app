import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Link from '@material-ui/core/Link';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

const PublicoLogo = "assets/images/publico_logo.png"
const ArquivoLogo = "assets/images/arquivo_logo.png"
const Supports = "assets/images/handshake.png"
const Opposes = "assets/images/discrimination.png"
const Neutral = "assets/images/conversation.png"

// loads news titles
function NewsTitles(props) {

    let raw_data = props.data

    function process_rel(rel_type){
      if (rel_type.includes('opposes')) {return Opposes} 
      else if (rel_type.includes('supports')) {return Supports}
      return Neutral
    }

    function process_article_link(rel_type){
      if (rel_type.startsWith('https://publico.pt')) {return <img width="15" src={PublicoLogo}/>} 
      return <img width="35" src={ArquivoLogo}/>
    }

    const headlines = raw_data.map(raw_data => (
      {
        title: raw_data.title.value, 
        url: raw_data.arquivo_doc.value,
        url_image: process_article_link(raw_data.arquivo_doc.value),
        date: raw_data.date.value,     
        rel_type: raw_data.rel_type.value,
        rel_image: process_rel(raw_data.rel_type.value),
        
        main_ent_image: raw_data.ent1_img.image_url,
        main_ent_name: raw_data.ent1_str.value,
        main_ent_url: raw_data.ent1.value.match(/Q\d+/g)[0],
        
        other_ent_image: raw_data.ent2_img.image_url,
        other_ent_name: raw_data.ent2_str.value,
        other_ent_url: raw_data.ent2.value.match(/Q\d+/g)[0]
      }))

    return headlines.map((entry, index) => (

      <Grid item key={index} sx={{ paddingTop: 1.5}} width={450}>
        <Card variant="elevation" raised="true">
          <CardContent>        
           
           {/* Date */}
          <Grid container>
              <Grid item alignContent={"center"}>
                <Typography variant="subtitle1" component="div" className="title-card" gutterBottom>
                  {entry.date}
                </Typography>
              </Grid>
          </Grid>

          {/* Entities */}
          <Grid container>
            <Grid item xs={2}></Grid>            
            
            <Grid item xs={3}>
              <Link href={`personalidade/${entry.main_ent_url}`} target="_blank">
                <Avatar alt={entry.focus_ent} src={entry.main_ent_image} sx={{ width: 66, height: 66 }}/>
                {entry.main_ent_name}
              </Link>
            </Grid>

            <Grid item xs={2}>
              <Link target="_blank">                
                <img width="40" src={entry.rel_image} alt={entry.rel_type}/>
              </Link>
            </Grid>

            <Grid item xs={3}>              
            <Link href={`personalidade/${entry.other_ent_url}`} target="_blank">
                <Avatar alt={entry.other_ent_name} src={entry.other_ent_image} sx={{ width: 66, height: 66 }}/>
                {entry.other_ent_name}
            </Link>
            </Grid>

            <Grid item xs={2}></Grid>                      
          </Grid>

          {/* Title */}
          <Grid container spacing={1} sx={{ paddingTop: 2 }}>
            <Grid item>
              <Typography variant="h7" component="div" align='center' fontWeight="450">"{entry.title}"
                <Link sx={{ m: 0.5 }} href={entry.url} target="_blank">{entry.url_image}</Link>
              </Typography>
            </Grid>
          </Grid>
          </CardContent>
        </Card>
      </Grid>
    ))
  }

export default NewsTitles;