import React from "react";

import { makeStyles, Grid } from '@material-ui/core';
import ReactJson from 'react-json-view';

import sleepingCat from './sleeping_cat.png';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1, marginTop: '30px' },
  cat: { flexGrow: 1, marginTop: '60px' },
  success: { color: '#4caf50' },
  failure: { color: '#f44336' }
}));

function Response(props) {
  const classes = useStyles();

  if (props.response == null) {
    return (
      <div class={classes.cat}>
        <Grid container spacing={3}>
          <Grid container item alignItems='center' justify="center" xs={12}>
            <img src={sleepingCat} width={300} />
          </Grid>
        </Grid>
      </div>
    );
  } else {
    let statusClass = classes.failure;

    if (props.status.code >= 200 && props.status.code < 300) {
      statusClass = classes.success;
    }

    return (
      <div class={classes.root}>
        <Grid container spacing={3}>
          <Grid container item xs={10}>
            <ReactJson src={props.response} collapsed={1} />
          </Grid>
          <Grid container item xs={2} justify="center">
            <h2 class={statusClass}>{props.status.code}</h2>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Response;
