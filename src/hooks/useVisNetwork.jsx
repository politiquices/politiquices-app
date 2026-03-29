import { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Link from '@mui/material/Link'

function useVisNetwork({ nodes, edges, Yearsvalues, onEdgeClick, onBackgroundClick }) {
  const container = useRef(null);
  const networkRef = useRef(null);

  const options = {
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
    },
    interaction: {
      navigationButtons: true,
      selectConnectedEdges: false,
    },
    nodes: {
      shape: 'dot',
      font: {
        size: 18,
        strokeWidth: 7,
      },
    },
    edges: {
      arrows: {
        to: { enabled: true },
      },
      length: 300,
      scaling: {
        min: 1,
        max: 5,
        label: {
          enabled: true,
          min: 14,
          max: 30,
          maxVisible: 30,
          drawThreshold: 5,
        },
        customScalingFunction(min, max, total, value) {
          if (max === min) {
            return 0.5;
          }
          const scale = 1 / (max - min);
          return Math.max(0, (value - min) * scale);
        },
      },
    },
    layout: {
      improvedLayout: false,
      hierarchical: {
        enabled: false,
        sortMethod: 'hubsize',
      },
    },
  };

  const [nodePopoverOpen, setNodePopoverOpen] = useState(false);
  const [nodePopoverAnchor, setNodePopoverAnchor] = useState(null);
  const [nodePopoverContent, setNodePopoverContent] = useState({});

  const [edgePopoverOpen, setEdgePopoverOpen] = useState(false);
  const [edgePopoverAnchor, setEdgePopoverAnchor] = useState(null);
  const [edgePopoverContent, setEdgePopoverContent] = useState({});

  const handleNodePopoverClose = () => {
    setNodePopoverOpen(false);
    setNodePopoverAnchor(null);
    setNodePopoverContent({});
  };

  const handleEdgePopoverClose = () => {
    setEdgePopoverOpen(false);
    setEdgePopoverAnchor(null);
    setEdgePopoverContent({});
  };

  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setData({ nodes, edges });
    } else {
      networkRef.current = new Network(container.current, { nodes, edges }, options);
      networkRef.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const nodeName = networkRef.current.body.nodes[nodeId].options.label;
          setNodePopoverContent({ id: nodeId, label: nodeName });
          setNodePopoverAnchor(params.event.center);
          setNodePopoverOpen(true);
        } else if (params.edges.length > 0) {
          const edgeId = params.edges[0];
          const edge = networkRef.current.body.edges[edgeId];
          const rel_type = edge.title === 'apoia' ? 'ent1_supports_ent2' : 'ent1_opposes_ent2';
          if (onEdgeClick) {
            onEdgeClick({ from: edge.from.id, to: edge.to.id, rel_type, label: edge.title });
          } else {
            const numNoticias = edges[edgeId-1].value;
            const [min, max] = Yearsvalues;
            setEdgePopoverContent({ from: edge.from.id, to: edge.to.id, rel_type, start: min, end: max, n_noticias: numNoticias, label: edge.title });
            setEdgePopoverAnchor(params.event.center);
            setEdgePopoverOpen(true);
          }
        } else {
          if (onBackgroundClick) onBackgroundClick();
        }
      });
    }
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [nodes, edges]);

  const nodePopover = (
    <Popover
      open={nodePopoverOpen}
      anchorReference="anchorPosition"
      anchorPosition={
        nodePopoverAnchor ? { top: nodePopoverAnchor.y, left: nodePopoverAnchor.x } : undefined
      }
      onClose={handleNodePopoverClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box p={2}>
        <Link href={`/personalidade/${nodePopoverContent.id}`} target="_blank" rel="noopener">
          {nodePopoverContent.label}
        </Link>
      </Box>
    </Popover>
  );

  const edgePopover = (
    <Popover
      open={edgePopoverOpen}
      anchorReference="anchorPosition"
      anchorPosition={edgePopoverAnchor ? { top: edgePopoverAnchor.y, left: edgePopoverAnchor.x } : undefined}
      onClose={handleEdgePopoverClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box p={2}>
        <Link
          href={`/versus/${edgePopoverContent.from}/${edgePopoverContent.rel_type}/${edgePopoverContent.to}/${edgePopoverContent.start}/${edgePopoverContent.end}`}
          target="_blank"
          rel="noopener"
        >
          {edgePopoverContent.label} ({edgePopoverContent.n_noticias})
        </Link>
      </Box>
    </Popover>
  );

  return { container, nodePopover, edgePopover };
}

export default useVisNetwork;
