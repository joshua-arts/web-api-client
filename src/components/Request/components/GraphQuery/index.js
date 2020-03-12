import React from "react";

import { Grid } from '@material-ui/core';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-coy.css';

const editorStyle = {
  fontFamily: '"Fira code", "Fira Mono", monospace',
  fontSize: 12,
  width: '100%',
  height: '80%',
  border: '1px solid lightgrey',
  borderRadius: '2px',
  margin: '6px',
  paddingBottom: '80px'
}

function GraphQuery(props) {
  return (
    <Grid container item xs={12}>
      <Grid container item xs={6}>
        <h3>Query</h3>
        <Editor
          value={props.graphQuery}
          onValueChange={ code => props.setGraphQuery(code) }
          highlight={code => highlight(code, languages.graphql)}
          padding={10}
          style={editorStyle}
        />
      </Grid>
      <Grid container item xs={6}>
        <h3>Query Variables</h3>
        <Editor
          value={props.graphVariables}
          onValueChange={code => props.setGraphVariables(code)}
          highlight={code => highlight(code, languages.json)}
          padding={10}
          style={editorStyle}
        />
      </Grid>
    </Grid>
  );
}

export default GraphQuery;
