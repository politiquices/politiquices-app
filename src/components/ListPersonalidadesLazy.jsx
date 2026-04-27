import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getPersonalitiesPaged, getPersonalitiesFiltered } from '../api'
import { GOVERNMENTS, ASSEMBLIES } from '../constants'

function ListPersonalidades({ personalities }) {
  return personalities.map((entry) => (
    <Grid item key={entry.wiki_id} width={250} align="center" columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
      <Link to={`/personalidade/${entry.wiki_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Avatar alt={entry.label} src={entry.local_image} sx={{ width: 125, height: 125 }} />
        {entry.label}
      </Link>
    </Grid>
  ));
}

function FetchPersonalidades() {
  const { t } = useTranslation()

  // Lazy-loaded state (Todas / Portuguesas)
  const [personalities, setPersonalities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [portugueseOnly, setPortugueseOnly] = useState(false);
  const [internationalOnly, setInternationalOnly] = useState(false);
  const loader = useRef(null);
  const pageRef = useRef(1);
  const portugueseOnlyRef = useRef(false);
  const internationalOnlyRef = useRef(false);
  const sessionRef = useRef(0);

  // Filtered state (Governo / Assembleia)
  const [selectedGoverno, setSelectedGoverno] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredLoading, setFilteredLoading] = useState(false);
  const [filteredError, setFilteredError] = useState(false);

  const isFiltered = !!(selectedGoverno || selectedAssembly);

  const fetchData = () => {
    const session = sessionRef.current;
    setIsLoading(true);
    getPersonalitiesPaged(pageRef.current, { portugueseOnly: portugueseOnlyRef.current, internationalOnly: internationalOnlyRef.current })
      .then((data) => {
        if (sessionRef.current !== session) return;
        setIsLoading(false);
        setPersonalities((prev) => [...prev, ...data]);
        pageRef.current++;
        setHasMore(data.length > 0);
      })
      .catch(() => {
        if (sessionRef.current !== session) return;
        setIsLoading(false);
        setIsError(true);
      });
  };

  const handleFilterChange = (_, value) => {
    if (value === null) return
    setSelectedGoverno('');
    setSelectedAssembly('');
    setFilteredData([]);
    portugueseOnlyRef.current = value === 'portuguese'
    internationalOnlyRef.current = value === 'international'
    setPortugueseOnly(value === 'portuguese')
    setInternationalOnly(value === 'international')
    setPersonalities([])
    pageRef.current = 1
    sessionRef.current += 1
    setHasMore(true)
    fetchData()
  }

  const handleFilteredSelect = (type, wikiId) => {
    if (type === 'government') {
      setSelectedGoverno(wikiId);
      setSelectedAssembly('');
    } else {
      setSelectedAssembly(wikiId);
      setSelectedGoverno('');
    }
    if (!wikiId) { setFilteredData([]); return; }
    setFilteredLoading(true);
    setFilteredError(false);
    getPersonalitiesFiltered(type, wikiId)
      .then((results) => {
        setFilteredData(results.map((r) => ({
          wiki_id: r.ent1.value.split('/').at(-1),
          label: r.ent1_name.value,
          local_image: r.image_url.value,
        })));
        setFilteredLoading(false);
      })
      .catch(() => {
        setFilteredError(true);
        setFilteredLoading(false);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFiltered) {
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
  }, [hasMore, isFiltered]);

  const localizeLabel = (name) =>
    name.replace('Governo', t('constants.government')).replace('Legislatura', t('constants.legislature'))

  return (
    <Box sx={{ paddingTop: 10 }}>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ mb: 3, gap: 2 }}>
        <ToggleButtonGroup
          value={portugueseOnly ? 'portuguese' : internationalOnly ? 'international' : 'all'}
          exclusive
          onChange={handleFilterChange}
          size="small"
        >
          <ToggleButton value="all">
            <Typography variant="body2">{t('personalities.all')}</Typography>
          </ToggleButton>
          <ToggleButton value="portuguese">
            <Typography variant="body2">{t('personalities.portuguese')}</Typography>
          </ToggleButton>
          <ToggleButton value="international">
            <Typography variant="body2">{t('personalities.international')}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>{t('filtered.government')}</InputLabel>
          <Select
            value={selectedGoverno}
            label={t('filtered.government')}
            onChange={(e) => handleFilteredSelect('government', e.target.value)}
          >
            <MenuItem value=""><em>{t('personalities.all')}</em></MenuItem>
            {GOVERNMENTS.map(([wikiId, name]) => (
              <MenuItem key={wikiId} value={wikiId}>{localizeLabel(name)}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>{t('filtered.assembly')}</InputLabel>
          <Select
            value={selectedAssembly}
            label={t('filtered.assembly')}
            onChange={(e) => handleFilteredSelect('assembly', e.target.value)}
          >
            <MenuItem value=""><em>{t('personalities.all')}</em></MenuItem>
            {ASSEMBLIES.map(([wikiId, name]) => (
              <MenuItem key={wikiId} value={wikiId}>{localizeLabel(name)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {isFiltered ? (
        <Box>
          {filteredLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {filteredError && <Typography color="error" align="center">{t('personalities.error')}</Typography>}
          {!filteredLoading && (
            <Grid container direction="row" spacing={6} justifyContent="space-evenly">
              <ListPersonalidades personalities={filteredData} />
            </Grid>
          )}
        </Box>
      ) : (
        <Grid container direction="row" spacing={6} justifyContent="space-evenly">
          <ListPersonalidades personalities={personalities} />
          {isLoading && <CircularProgress sx={{ alignSelf: 'center' }} />}
          {isError && <Typography color="error">{t('personalities.error')}</Typography>}
          <div ref={loader} />
        </Grid>
      )}
    </Box>
  );
}

export default FetchPersonalidades;
