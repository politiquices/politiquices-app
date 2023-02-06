/* eslint-disable react/self-closing-comp */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import Box from '@mui/material/Box'

const nodesTmp = [
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' },
]

const edgesTmp = [
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 3 },
]

function VisNetwork(nodes, edges) {
  const container = useRef(null)

  const options = {}

  nodes = nodesTmp
  edges = edgesTmp

  useEffect(() => {
    const network = container.current && new Network(container.current, { nodes, edges }, options)
  }, [container, nodes, edges])

  return (
    <Box alignItems="center">
      <div
        ref={container}
        style={{
          'margin-left': '100px',
          'margin-top': '100px',
          height: '500px',
          width: '1000px',
          border: '1px solid rgb(0, 0, 0)',
        }}
      ></div>
    </Box>
  )
}

export default VisNetwork
