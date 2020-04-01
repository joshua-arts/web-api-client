import React from "react";

import { makeStyles, Button, Grid, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: { width: '95%' },
  headerInput: {
    flexGrow: 1,
    marginBottom: '10px'
  }
}));

function Headers(props) {
  const classes = useStyles();
  let headers = props.headers;

  const newHeader = () => {
    props.setHeaders(headers => [...headers, { key: '', value: '' }]);
  }

  const updateHeader = (i, prop) => e => {
    let newHeaders = [...headers];
    newHeaders[i][prop] = e.target.value;

    props.setHeaders(newHeaders);
  }

  const deleteHeader = (i) => {
    if (headers.length === 1) {
      console.log("Must leave atleast one header.");
      return;
    }

    let newHeaders = [...headers];

    if (i !== -1) {
      newHeaders.splice(i, 1);
      props.setHeaders(newHeaders);
    }
  }


  const headerInputs = headers.map(function(header, i) {
    return (
      <div key={`header-${i}`} className={classes.headerInput}>
        <Grid container spacing={2}>
          <Grid container item xs={3}>
            <TextField onChange={updateHeader(i, 'key')} value = {header.key} id="outlined-basic" label="Key" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid container item xs={8}>
            <TextField onChange={updateHeader(i, 'value')} value = {header.value} id="outlined-basic" label="Value" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid container item xs={1} alignItems="center" justify="center">
            <IconButton aria-label="delete" onClick={() => deleteHeader(i)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  });

  return (
    <Grid className={classes.root} container>
      <Grid container item xs={12} spacing={2}>
        <Grid container item xs={11} alignItems="flex-start" justify="flex-start">
          <h3>Headers</h3>
        </Grid>
        <Grid container item xs={1} spacing={2} alignItems="center" justify="center">
          <Button onClick={newHeader} fullWidth size="small" variant="contained" color="primary">
            New
          </Button>
        </Grid>
      </Grid>
      { headerInputs }
    </Grid>
  );
}

export default Headers;
