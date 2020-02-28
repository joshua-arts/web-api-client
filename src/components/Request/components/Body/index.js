import React from "react";

import { Grid } from '@material-ui/core';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const jsonInputStyle = {
  outerBox: {
    border: '1px solid lightgrey',
    borderRadius: '2px'
  }
}

function Body(props) {
  const updateRequestBody = (value) => {
    props.setRequestBody(value.jsObject);
  }

  return (
    <Grid container item xs={12}>
      <h3>Body</h3>
      <JSONInput
        id='requestBody'
        placeholder={props.requestBody}
        theme='light_mitsuketa_tribute'
        locale={locale}
        height='200px'
        width='100%'
        style={jsonInputStyle}
        onChange={updateRequestBody}
      />
    </Grid>
  );
}

export default Body;
