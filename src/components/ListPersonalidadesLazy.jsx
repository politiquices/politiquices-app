import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { getPersonalitiesPaged } from '../api'

function ListPersonalidades({ personalities }) {
  return personalities.map((entry) => (
    <Grid item key={entry.wiki_id} width={250} align="center" columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
      <Link justify="center" href={`personalidade/${entry.wiki_id}`}>
        <Avatar alt={entry.focus_ent} src={entry.local_image} sx={{ width: 125, height: 125 }} />
        {entry.label}
      </Link>
    </Grid>
  ));
}

function FetchPersonalidades() {
  const [personalities, setPersonalities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [portugueseOnly, setPortugueseOnly] = useState(false);
  const loader = useRef(null);
  const pageRef = useRef(1);
  const portugueseOnlyRef = useRef(false);

  const fetchData = () => {
    setIsLoading(true);
    getPersonalitiesPaged(pageRef.current, portugueseOnlyRef.current)
      .then((data) => {
        setIsLoading(false);
        setPersonalities((prev) => [...prev, ...data]);
        pageRef.current++;
        setHasMore(data.length > 0);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  const handleFilterChange = (_, value) => {
    if (value === null) return
    const isPortuguese = value === 'portuguese'
    portugueseOnlyRef.current = isPortuguese
    setPortugueseOnly(isPortuguese)
    setPersonalities([])
    pageRef.current = 1
    setHasMore(true)
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchData();
      }
    }, { threshold: 1 });
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore]);

  return (
    <Box sx={{ paddingTop: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={portugueseOnly ? 'portuguese' : 'all'}
          exclusive
          onChange={handleFilterChange}
          size="small"
        >
          <ToggleButton value="all">
            <Typography variant="body2">Todas</Typography>
          </ToggleButton>
          <ToggleButton value="portuguese">
            <Typography variant="body2">Portuguesas</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container direction="row" spacing={6} justifyContent="space-evenly">
        <ListPersonalidades personalities={personalities} />
        {isLoading && <CircularProgress sx={{ alignSelf: 'center' }} />}
        {isError && <div>Error fetching data.</div>}
        <div ref={loader} />
      </Grid>
    </Box>
  );
}

export default FetchPersonalidades;
