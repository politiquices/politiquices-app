import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ArticlesYearBar({ data }) {
  const [showChart, setShowChart] = useState(true);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setShowChart(!showChart)}>
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </Button>
      </Box>
      {showChart && (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} margin={{ top: 20, right: 150, bottom: 20, left: 150 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar dataKey="opposes" fill="#FF0000" />
            <Bar dataKey="supports" fill="#44861E" />
            <Bar dataKey="opposed_by" fill="#980000" />
            <Bar dataKey="supported_by" fill="#70DA33" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default ArticlesYearBar
