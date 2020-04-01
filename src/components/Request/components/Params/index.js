import React from "react";

import { makeStyles, Button, Grid, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: { width: '95%' },
  paramInput: {
    flexGrow: 1,
    marginBottom: '10px'
  }
}));

function Params(props) {
  const classes = useStyles();
  let params = props.params;

  const newParam = () => {
    props.setParams(params => [...params, { key: '', value: '' }]);
  }

  const updateParam = (i, prop) => e => {
    let newParams = [...params];
    newParams[i][prop] = e.target.value;

    props.setParams(newParams);
  }

  const deleteParam = (i) => {
    if (params.length === 1) {
      console.log("Must leave atleast one param.");
      return;
    }

    let newParam = [...params];

    if (i !== -1) {
      newParam.splice(i, 1);
      props.setParams(newParam);
    }
  }

  const paramInputs = params.map(function (param, i) {
    return (
      <div key={`param-${i}`} className={classes.paramInput}>
        <Grid container spacing={2}>
          <Grid container item xs={3}>
            <TextField disabled={props.disabled} onChange={updateParam(i, 'key')} value={param.key} id="outlined-basic" label="Key" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid container item xs={8}>
            <TextField disabled={props.disabled} onChange={updateParam(i, 'value')} value={param.value} id="outlined-basic" label="Value" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid container item xs={1} alignItems="center" justify="center">
            <IconButton aria-label="delete" onClick={() => deleteParam(i)}>
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
          <h3>Parameters</h3>
        </Grid>
        <Grid container item xs={1} spacing={2} alignItems="center" justify="center">
          <Button disabled={props.disabled} onClick={newParam} fullWidth size="small" variant="contained" color="primary">
            New
          </Button>
        </Grid>
      </Grid>
      {paramInputs}
    </Grid>
  );
}

export default Params;
