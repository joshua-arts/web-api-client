import React from "react";

import { makeStyles, Grid, TextField } from '@material-ui/core';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';


const useStyles = makeStyles(theme => ({
  shortWidth: { width: '95%' }
}));

const jsonInputStyle = {
  outerBox: {
    border: '1px solid lightgrey',
    borderRadius: '2px'
  }
}

function GraphQuery(props) {
  const classes = useStyles();

  // TODO: Add some sort of formatting here...
  const updateGraphQuery = (event) => {
    props.setGraphQuery(event.target.value);
  }

  return (
    <Grid container item xs={12}>
      <Grid container item xs={6}>
        <h3>Query</h3>
        <TextField
          id="graphQuery"
          multiline
          rows={10}
          value={props.graphQuery}
          variant="outlined"
          onChange={updateGraphQuery}
          fullWidth
          class={classes.shortWidth}
        />
      </Grid>
      <Grid container item xs={6} alignItems="flex-end" justify="flex-end" >
        <h3>Query Variables</h3>
        <JSONInput
          id='requestBody'
          placeholder={props.requestBody}
          theme='light_mitsuketa_tribute'
          locale={locale}
          height='200px'
          width='95%'
          style={jsonInputStyle}
          // onChange={updateRequestBody}
        />
      </Grid>
    </Grid>
  );
}

export default GraphQuery;
