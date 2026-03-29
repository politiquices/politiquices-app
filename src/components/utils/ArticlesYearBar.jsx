import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ArticlesYearBar({ data }) {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setShowChart(!showChart)}>
          Linha Temporal
        </Button>
      </Box>
      {showChart && (
        <ResponsiveContainer width="100%" aspect={3}>
          <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
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
