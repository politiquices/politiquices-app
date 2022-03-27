import React from 'react';
import Grid from '@mui/material/Grid';

const GridSystem = ({ children }) => {

    const renderGrid = () => {
        let cols = []
        for(let index = 0; index < children.length; index++) {
            cols.push(
                <Grid item xs={3}>
                    {children[index]}
                </Grid>
            )
        }
        return cols
    }

    return (
        <Grid container 
            rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            spacing={0.5}
            //alignItems="left"
            //justifyContent="center"
            style={{ minHeight: '100vh' }}
            >
            {renderGrid()}
        </Grid>
    );
};

export default GridSystem;