import Select from 'react-select'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import { MIN_YEAR as minYear, MAX_YEAR as maxYear } from '../constants'

function GrafoControls({
  personalities,
  selectedOption,
  handleChange,
  Yearsvalues,
  handleChangeYears,
  minNoticias,
  handleMinNoticiasChange,
  onlyAmongSelected,
  handleChangePersons,
  onlySentiment,
  handleChangeRelationships,
  handleClick,
}) {
  const { t } = useTranslation()
  return (
    <>
      {/* select personalities */}
      <Grid container sx={{ paddingTop: 9 }}>
        <Grid item xs={4} />
        <Grid item xs={4} sx={{ paddingTop: 2 }}>
          <Select className="centered" isMulti value={selectedOption} onChange={handleChange} options={personalities} />
        </Grid>
        <Grid item xs={4} />
      </Grid>

      {/* dates interval */}
      <Grid container sx={{ paddingTop: 1 }}>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <center>
            <Box sx={{ width: 400 }}>
              <Slider
                getAriaLabel={() => t('grafo.dateRange')}
                value={Yearsvalues}
                onChange={handleChangeYears}
                valueLabelDisplay="auto"
                min={minYear}
                max={maxYear}
              />
            </Box>
          </center>
        </Grid>
      </Grid>

      {/* switch buttons */}
      <Grid container alignItems="center" spacing={0} sx={{ width: '80%', margin: 'auto', paddingTop: -1 }}>
        <Grid item xs={2} />
        <Grid item xs={2} container direction="column" alignItems="center">
          <TextField
            id="minNoticias"
            label={t('grafoControls.minNews')}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            size="small"
            value={minNoticias}
            onChange={handleMinNoticiasChange}
          />
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          <Grid item>
            <Switch checked={onlyAmongSelected} onChange={handleChangePersons} />
          </Grid>
          <Grid item>
            <Typography variant="body1">{t('grafoControls.onlyAmongSelected')}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          <Grid item>
            <Switch checked={onlySentiment} onChange={handleChangeRelationships} />
          </Grid>
          <Grid item>
            <Typography variant="body1">{t('grafoControls.onlySentiment')}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>

      {/* update button */}
      <Grid container>
        <Grid item xs={4} />
        <Grid item xs={4} sx={{ paddingBottom: 2 }}>
          <center>
            <Button
              variant="contained"
              onClick={() => {
                handleClick();
              }}
            >
              {t('grafoControls.update')}
            </Button>
          </center>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    </>
  );
}

export default GrafoControls
