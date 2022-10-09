import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from '@material-ui/core/Link';
import CardContent from '@mui/material/CardContent';
import PublicoLogo from "../../images/114px-Logo_publico.png"

// Loads news titles for a given personality
function NewsTitles(props) {

    let raw_data = props.data

    const headlines = raw_data.map(raw_data => (
      {
        title: raw_data.title.value, 
        url: raw_data.arquivo_doc.value, 
        date: raw_data.date.value,     
        rel_type: raw_data.rel_type.value,
        
        main_ent_image: raw_data.ent1_img.image_url,
        main_ent_name: raw_data.ent1_str.value,
        main_ent_url: raw_data.ent1.value.match(/Q\d+/g)[0],
        
        other_ent_image: raw_data.ent2_img.image_url,
        other_ent_name: raw_data.ent2_str.value,
        other_ent_url: raw_data.ent2.value.match(/Q\d+/g)[0]
      }
      ))

    return headlines.map((entry) => (
      <Grid item md={1}>
        <Card variant="outlined" sx={{ minWidth: 375 }}>
          <CardContent>        
            <Typography variant="h6" component="div">          
              {entry.date}
            </Typography>
          </CardContent>
          <CardContent>
  
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Link href={`personalidade/${entry.main_ent_url}`} target="_blank">
                  <Avatar alt={entry.focus_ent} src={entry.main_ent_image} sx={{ width: 76, height: 76 }}/>
                </Link>
              </Grid>
              <Grid item xs={4}>
                {entry.title}
              </Grid>
              <Grid item xs={4}>              
              <Link href={`personalidade/${entry.other_ent_url}`} target="_blank">
                  <Avatar alt={entry.other_ent_name} src={entry.other_ent_image} sx={{ width: 76, height: 76 }}/>
                </Link>
              </Grid>
            </Grid>
          
          </CardContent>
          <CardContent>          
              <Typography variant="h10">          
                {entry.rel_type}              
              </Typography>
  
              <Link href={entry.url} target="_blank"><img width="25" src={PublicoLogo}/></Link>                               
          </CardContent>
        </Card>
      </Grid>
    ))
  }

export default NewsTitles;