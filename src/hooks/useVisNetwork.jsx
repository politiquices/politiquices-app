import { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Link from '@mui/material/Link'

function useVisNetwork({ nodes, edges, Yearsvalues, onEdgeClick, onBackgroundClick }) {
  const container = useRef(null);
  const networkRef = useRef(null);

  // Keep refs fresh so the stable click handler always sees current values
  const edgesRef = useRef(edges);
  const yearsRef = useRef(Yearsvalues);
  const onEdgeClickRef = useRef(onEdgeClick);
  const onBackgroundClickRef = useRef(onBackgroundClick);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  useEffect(() => { yearsRef.current = Yearsvalues; }, [Yearsvalues]);
  useEffect(() => { onEdgeClickRef.current = onEdgeClick; }, [onEdgeClick]);
  useEffect(() => { onBackgroundClickRef.current = onBackgroundClick; }, [onBackgroundClick]);

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
    if (!container.current) return
    const observer = new ResizeObserver(() => {
      networkRef.current?.redraw()
      networkRef.current?.fit()
    })
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  // Create network once on mount, destroy on unmount
  useEffect(() => {
    if (!container.current) return;
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
        if (onEdgeClickRef.current) {
          onEdgeClickRef.current({ from: edge.from.id, to: edge.to.id, rel_type, label: edge.title });
        } else {
          const numNoticias = edgesRef.current[edgeId - 1]?.value;
          const [min, max] = yearsRef.current;
          setEdgePopoverContent({ from: edge.from.id, to: edge.to.id, rel_type, start: min, end: max, n_noticias: numNoticias, label: edge.title });
          setEdgePopoverAnchor(params.event.center);
          setEdgePopoverOpen(true);
        }
      } else {
        if (onBackgroundClickRef.current) onBackgroundClickRef.current();
      }
    });
    return () => {
      networkRef.current?.destroy();
      networkRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data without destroying/recreating — preserves layout
  useEffect(() => {
    networkRef.current?.setData({ nodes, edges });
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

  const resetLayout = () => {
    networkRef.current?.stabilize()
  }

  return { container, nodePopover, edgePopover, resetLayout };
}

export default useVisNetwork;
