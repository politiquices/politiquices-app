import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}


const Demo = () => {
    
    const [loading, setLoading] = useState(false);
    const [quote, setQuote] = useState({});
    
    const getRandomQuote = () => {
        setLoading(true);
        fetch('https://api.quotable.io/random')
          .then((res) => res.json())
          .then((data) => {
            setLoading(false);
            setQuote(data);
          });
      };
    
      return (
        <div className="container">
          {loading ? (
            <CircularIndeterminate/>
          ) : (
            <div className="main-content">
              <h1>Hello World!</h1>
              <p>
                This is a demo Project to show how to add animated loading with
                React.
              </p>
              <div className="buttons">
                <button className="btn get-quote" onClick={getRandomQuote}>
                  Generate Quote
                </button>
              </div>
              <div className="quote-section">
                <blockquote className="quote">{quote.content}</blockquote>-{' '}
                <span className="author">{quote.author}</span>
              </div>
            </div>
          )}
        </div>
    );
};

export default Demo;