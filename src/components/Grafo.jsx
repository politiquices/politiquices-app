/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { getPersons, getTimeline } from '../api'
import GrafoControls from './GrafoControls'
import useVisNetwork from '../hooks/useVisNetwork'

function VisNetwork() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [Yearsvalues, setValue] = useState([2000, 2024]);
  const [personalities, setPersonalities] = useState();
  const [minNoticias, setMinNoticias] = useState(10);
  const [onlyAmongSelected, setOnlyAmongSelected] = useState(true);
  const [onlySentiment, setOnlySentiment] = useState(true);
  const [isError, setIsError] = useState(false);

  const { container, nodePopover, edgePopover } = useVisNetwork({ nodes, edges, Yearsvalues });

  // read the persons.json to fill the select
  function loadPersonalities() {
    getPersons()
      .then((data) => {
        setPersonalities(data);
      })
      .catch(() => {
        setIsError(true);
      });
  }

  useEffect(() => {
    loadPersonalities();
  }, []);

  // handle 'Actualizar' button click
  const handleClick = async () => {
    const persons = selectedOption ? selectedOption.map((a) => a.value) : [];
    const [min, max] = Yearsvalues;
    getTimeline({ persons, onlyAmongSelected, onlySentiment, start: min, end: max, minFreq: minNoticias })
      .then((data) => {
        setNodes(data.nodes);
        setEdges(data.edges);
      })
      .catch(() => {
        setIsError(true);
      });
  };

  const handleChange = (e) => {
    setSelectedOption(e);
  };

  const handleChangeRelationships = (e) => {
    setOnlySentiment(e.target.checked);
  };

  const handleChangePersons = (e) => {
    setOnlyAmongSelected(e.target.checked);
  };

  const handleChangeYears = (event, yearsValues) => {
    setValue(yearsValues);
  };

  const handleMinNoticiasChange = (event) => {
    // eslint-disable-next-line radix
    setMinNoticias(parseInt(event.target.value));
  };

  return (
    <>
      <GrafoControls
        personalities={personalities}
        selectedOption={selectedOption}
        handleChange={handleChange}
        Yearsvalues={Yearsvalues}
        handleChangeYears={handleChangeYears}
        minNoticias={minNoticias}
        handleMinNoticiasChange={handleMinNoticiasChange}
        onlyAmongSelected={onlyAmongSelected}
        handleChangePersons={handleChangePersons}
        onlySentiment={onlySentiment}
        handleChangeRelationships={handleChangeRelationships}
        handleClick={handleClick}
      />

      {nodePopover}
      {edgePopover}

      {isError && <div>Erro ao carregar dados.</div>}

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
