import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Link from '@material-ui/core/Link';
import CircularProgress from '@mui/material/CircularProgress';

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
  const loader = useRef(null);
  const pageRef = useRef(1); // Use useRef to store the latest page value

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_POLITIQUICES_API}/personalities/${pageRef.current}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setPersonalities((prevPersonalities) => [...prevPersonalities, ...data]);
        // eslint-disable-next-line no-plusplus
        pageRef.current++;
        setHasMore(data.length > 0);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchData();
        console.log('fetching more data');
        console.log('page:', pageRef);
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
  }, [hasMore]); // Observe when loader is visible

  return (
    <Grid container direction="row" spacing={6} justifyContent="space-evenly" sx={{ paddingTop: 10 }}>
      <ListPersonalidades personalities={personalities} />
      {isLoading && <CircularProgress sx={{ alignSelf: 'center' }} />}
      {isError && <div>Error fetching data.</div>}
      <div ref={loader} />
    </Grid>
  );
}

export default FetchPersonalidades;
