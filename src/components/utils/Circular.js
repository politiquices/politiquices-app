import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

function CircularIndeterminate() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '50vh' }} // Ensures the box takes up the full viewport height
    >
      <CircularProgress />
    </Box>
  )
}

export default CircularIndeterminate
