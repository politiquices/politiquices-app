import * as React from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

export default function RangeSlider () {
  const [value, setValue] = React.useState([2000, 2014])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Intervalo Datas'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={1994}
        max={2022}
      />
    </Box>
  )
}
