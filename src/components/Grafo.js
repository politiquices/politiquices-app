/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'; // https://react-select.com/home
import { Network } from 'vis-network';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import TextField from '@material-ui/core/TextField';
import Popover from '@mui/material/Popover';
import Link from '@mui/material/Link';

let state = { selectedOption: null };
let onlyAmongSelected = true;
let onlySentiment = true;
const minYear = 1994;
const maxYear = 2024;

function VisNetwork() {
  const container = useRef(null);
  const networkRef = useRef(null);

  // see: https://visjs.github.io/vis-network/docs/network/#options

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
        max: 15,
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

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [Yearsvalues, setValue] = useState([2000, 2024]);
  const [personalities, setPersonalities] = useState();
  const [minNoticias, setMinNoticias] = useState(10);
  
  const [nodePopoverOpen, setNodePopoverOpen] = useState(false);
  const [nodePopoverAnchor, setNodePopoverAnchor] = useState(null);
  const [nodePopoverContent, setNodePopoverContent] = useState({});

  const [edgePopoverOpen, setEdgePopoverOpen] = useState(false);
  const [edgePopoverAnchor, setEdgePopoverAnchor] = useState(null);
  const [edgePopoverContent, setEdgePopoverContent] = useState({});


  // read the persons.json to fill the select
  function loadPersonalities() {
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/persons/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPersonalities(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    loadPersonalities();
  }, []);

  // handle 'Actualizar' button click
  const handleClick = async () => {
    // get selected persons
    const result = state.map((a) => a.value);
    let params = '';
    for (let i = 0; i < result.length; i += 1) {
      params += `&q=${result[i]}`;
    }

    // get years range
    const [min, max] = Yearsvalues;

    params += `&selected=${onlyAmongSelected}`;
    params += `&sentiment=${onlySentiment}`;
    params += `&start=${min}`;
    params += `&end=${max}`;
    params += `&min_freq=${minNoticias}`;

    console.log(params);

    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/timeline/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.nodes);
        console.log(data.edges);
        setNodes(data.nodes);
        setEdges(data.edges);
        console.log('nodes: ', nodes);
        console.log('edges: ', edges);
        console.log('data: ', data);
      })
      .catch((err) => {
        console.log(err);
      });
    setSelectedOption(state);
  };

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e);
    state = e;
  };

  const handleChangeRelationships = (e) => {
    onlySentiment = e.target.checked;
  };

  const handleChangePersons = (e) => {
    onlyAmongSelected = e.target.checked;
  };

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues);
  };

  const handleMinNoticiasChange = (event) => {
    // eslint-disable-next-line radix
    setMinNoticias(parseInt(event.target.value));
  };

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
        }
        if (params.edges.length > 0) {
          const edgeId = params.edges[0];
          const edge = networkRef.current.body.edges[edgeId];
          console.log(edgeId);
          console.log(edge.id);
          console.log(edge.title);
          console.log(edge.from.id);
          console.log(edge.to.id);
          const numNoticias = edges[edgeId-1].value;
          const [min, max] = Yearsvalues;
          if (edge.title === 'apoia') {
            setEdgePopoverContent({ from: edge.from.id, to: edge.to.id, rel_type: 'ent1_supports_ent2', start: min, end: max, n_noticias: numNoticias, label: edge.title });
          } else if (edge.title === 'opõe-se') {
            setEdgePopoverContent({ from: edge.from.id, to: edge.to.id, rel_type: 'ent1_opposes_ent2', start: min, end: max, n_noticias: numNoticias, label: edge.title });
          }
          setEdgePopoverAnchor(params.event.center);
          setEdgePopoverOpen(true);
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

  return (
    <>

      {/* select personalities */}
      <Grid container sx={{ paddingTop: 9 }}>
        <Grid item xs={4} />
        <Grid item xs={4} sx={{ paddingTop: 2 }}>
          <Select class="centered" isMulti value={selectedOption} onChange={handleChange} options={personalities} />
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
                getAriaLabel={() => 'Intervalo Datas'}
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
            label="nº min noticias"
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
            <Switch defaultChecked={onlyAmongSelected} onChange={handleChangePersons} />
          </Grid>
          <Grid item>
            <Typography variant="body1">Apenas entre os seleccionados</Typography>
          </Grid>
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          <Grid item>
            <Switch defaultChecked={onlySentiment} onChange={handleChangeRelationships} />
          </Grid>
          <Grid item>
            <Typography variant="body1">Apenas notícias apoio/oposição</Typography>
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
              Actualizar
            </Button>
          </center>
        </Grid>
        <Grid item xs={4} />
      </Grid>

      {/* Node Popover */}
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

      {/* Edge Popover */}
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
          <Link href={`/versus/${edgePopoverContent.from}/${edgePopoverContent.rel_type}/${edgePopoverContent.to}/${edgePopoverContent.start}/${edgePopoverContent.end}`}
          target="_blank" rel="noopener">
          {edgePopoverContent.label} ({edgePopoverContent.n_noticias})
          </Link>
        </Box>
      </Popover>

      <Box alignItems="center">
        <div
          ref={container}
          style={{
            marginTop: '10px',
            height: '650px',
            width: '1250px',
            border: '1px solid rgb(0, 0, 0)',
          }}
        ></div>
      </Box>

    </>
  );
}

export default VisNetwork;
