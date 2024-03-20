import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

function CircularIndeterminate() {
  return (
    <Box alignItems="center" sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  )
}

export default CircularIndeterminate
