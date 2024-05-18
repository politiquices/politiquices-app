/* eslint-disable react/self-closing-comp */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select' // https://react-select.com/home
import { Network } from 'vis-network'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography';
import TextField from '@material-ui/core/TextField';
import NewsTitles from './utils/NewsTitles'


let state = { selectedOption: null }
let onlyAmongSelected = true
let onlySentiment = true
const minYear = 1994
const maxYear = 2024

function VisNetwork() {
  const container = useRef(null)

  // see: https://visjs.github.io/vis-network/docs/network/#options
  
  const options = {
    physics:{
        enabled: true,
        // solver: 'repulsion'
        solver: 'forceAtlas2Based'
    },
    interaction: {
        navigationButtons: true,
        selectConnectedEdges: false
    },
    nodes: {
      shape: 'dot',
      font: {
        size: 18,
        strokeWidth: 7},
      },
    edges: {
      arrows: {
        to: { enabled: true }
      },
      length: 300,
      scaling:{
            min: 1,
            max: 15,
            label: {
                enabled: true,
                min: 14,
                max: 30,
                maxVisible: 30,
                drawThreshold: 5
            },
            customScalingFunction (min,max,total,value) {
                if (max === min) {
                    return 0.5;
                }
                
                    const scale = 1 / (max - min);
                    return Math.max(0,(value - min)*scale);
                
            }
      }
    },
    layout: {
      improvedLayout: false,
      hierarchical: {
        enabled: false,
        sortMethod: 'hubsize'
      }
    },

  };

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedOption, setSelectedOption] = useState()
  const [Yearsvalues, setValue] = useState([2000, 2024])
  const [personalities, setPersonalities] = useState()
  const [minNoticias, setMinNoticias] = useState(10);

  // read the persons.json to fill the select
  function loadPersonalities() {
    setLoading(true)
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/persons/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPersonalities(data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    console.log("calling useEffect 1")
    loadPersonalities()
  }, [])

  // handle 'Actualizar' button click
  const handleClick = async () => {
    
    // get selected persons
    const result = state.map((a) => a.value)
    let params = ''
    for (let i = 0; i < result.length; i += 1) {
      params += `&q=${result[i]}`
    }

    // get years range
    const [min, max] = Yearsvalues

    params += `&selected=${onlyAmongSelected}`
    params += `&sentiment=${onlySentiment}`
    params += `&start=${min}`
    params += `&end=${max}`
    params += `&min_freq=${minNoticias}`

    console.log(params)

    setLoading(true)

    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/timeline/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data.news)
        setNodes(data.nodes)
        setEdges(data.edges)
        setLoading(false)
        console.log("nodes: ", nodes)
        console.log("edges: ", edges)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
    setSelectedOption(state)
  }

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedOption(e)
    state = e
  }

  const handleChangeRelationships = (e) => {
    onlySentiment = e.target.checked
  }

  const handleChangePersons = (e) => {
    onlyAmongSelected = e.target.checked
  }

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues)
  }

  const handleMinNoticiasChange = (event) => {
    // eslint-disable-next-line radix
    setMinNoticias(parseInt(event.target.value));
  };
  

  useEffect(() => {
    console.log("calling useEffect 2")
  	// Use `network` here to configure events, etc.

    const network = container.current && new Network(container.current, { nodes, edges }, options);

    /*
    network.on('click', (params) => {
        
      params.event.preventDefault();
      pointer = params['pointer']['DOM']
      node = network.getNodeAt(pointer)
      edge = network.getEdgeAt(pointer)

      // clicked nothing
      if (node == null && edge == null) {
        $(".custom-menu").hide();
      }

      // clicked a Node
      else if ((node != null && edge != null) || (node != null && edge == null)) {       
        var node_id = node;
        var node_name = network.body.nodes[node_id].options['label']
        var hostname = window.location.origin
        var url = `${hostname}/entity?q=${node_id}`
        var entity_html = `<a href=${url} target="_blank">${node_name}</a>`
        $(".custom-menu").find('#noticias').html(entity_html);
        $(".custom-menu").find('#ent1').html('');
        $(".custom-menu").find('#rel_type').html('');
        $(".custom-menu").find('#ent2').html('');
        $(".custom-menu").css({
          top: params['event']['center']['y'] + "px",
          left: params['event']['center']['x'] + "px"
        });
        $(".custom-menu").show()
      }
      
      // clicked an Edge
      else if (node == null && edge != null) {          
        var edge_id = edge
        var rel_text = network.body.edges[edge_id].options.title;
        var rel_type = rel_type_map[rel_text]
        var freq = network.body.edges[edge_id].options.value
        var from = network.body.edges[edge_id]["fromId"]
        var to = network.body.edges[edge_id]["toId"]
        var from_name = network.body.nodes[from].options['label']
        var to_name = network.body.nodes[to].options['label']
        var hostname = window.location.origin
        var year_from = $("#ano_from").text();
        var year_to = $("#ano_to").text();
        var url = `${hostname}/queries?&e1=${from}&e2=${to}&year_from=$
        {year_from}&year_to=${year_to}&relationship=${rel_type}`
        var noticias_html = `<a href=${url} target="_blank">${freq} notícias</a>`
        var e1_url = `${hostname}/entity?q=${from}`
        var e1_html = `<a href=${e1_url} target="_blank">${from_name}</a>`
        var e2_url = `${hostname}/entity?q=${to}`
        var e2_html = `<a href=${e2_url} target="_blank">${to_name}</a>`
        rel_html = `<b>${rel_text}</b>`
        $(".custom-menu").find('#noticias').html(noticias_html);
        $(".custom-menu").find('#ent1').html(e1_html);
        $(".custom-menu").find('#rel_type').html(rel_html);
        $(".custom-menu").find('#ent2').html(e2_html);
        $(".custom-menu").css({
          top: params['event']['center']['y'] + "px",
          left: params['event']['center']['x'] + "px"
        });
        $(".custom-menu").show()

      }

    });
    */

    /*
    const showPopup = (nodeData, nodePosition) => {
      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.left = `${nodePosition.left + container.current.offsetLeft}px`;
      box.style.top = `${nodePosition.top + container.current.offsetTop}px`;
      box.style.padding = '10px';
      box.style.backgroundColor = 'white';
      box.style.border = '1px solid black';
      box.style.zIndex = 1000;

      const content = document.createElement('div');
      content.innerText = `Node Data: ${JSON.stringify(nodeData, null, 2)}`;
      
      const link = document.createElement('a');
      link.href = 'https://www.publico.pt';
      link.target = '_blank';
      link.innerText = 'Go to Publico.pt';
      
      box.appendChild(content);
      box.appendChild(link);
      
      document.body.appendChild(box);

      setTimeout(() => {
        document.body.removeChild(box);
      }, 5000);
    };
    */

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        // const nodePosition = network.getPositions([nodeId])[nodeId];
        // console.log(nodePosition);
        // window.open('https://www.publico.pt', '_blank');
        const nodeData = nodes.get(nodeId);
        console.log(nodeId);
        console.log(nodeData);
        // showPopup(nodeData, network.getBoundingBox(nodeId));
      }
    });

  }, [container, nodes, edges]);

  return (
    <>
    <Box alignItems="center">
      <div
        ref={container}
        style={{
          'margin-top': '100px',
          height: '650px',
          width: '1250px',
          border: '1px solid rgb(0, 0, 0)',
        }}
      ></div>
    </Box>
    
    {/* select personalities */}
    <Grid container sx={{ paddingTop: 2 }}>
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
    <Grid container alignItems="center" spacing={1} sx={{ width: '80%', margin: 'auto', paddingTop: -1 }}>
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
              handleClick()
            }}
          >
            Actualizar
          </Button>
        </center>
      </Grid>
      <Grid item xs={4} />
    </Grid>

    {/* news titles 
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
      sx={{ paddingTop: 10 }}
    >      
      {!response ? <p /> : <NewsTitles data={response} />}
    </Grid>
    */}
  </>
  )
    }

export default VisNetwork
