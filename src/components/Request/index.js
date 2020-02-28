import React, { useEffect, useState } from "react";

import {
  makeStyles,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField
} from '@material-ui/core';

import Headers from './components/Headers';
import Params from './components/Params';
import Body from './components/Body';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1, marginTop: '40px' },
}));

function Request(props) {
  const classes = useStyles();

  const [requestType, setRequestType] = useState('get');
  const [endpoint, setEndpoint] = useState('https://api.github.com');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [requestBody, setRequestBody] = useState({ key: 'value' });

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const updateRequestType = () => e => {
    setRequestType(e.target.value);
  };

  const updateEndpoint = () => e => {
    let endpoint = e.target.value;

    if (endpoint.includes("?")) {
      endpoint = endpoint.substr(0, endpoint.indexOf('?'));
    }

    setEndpoint(endpoint);
  }

  const serializeUrlParams = () => {
    let urlParams = "?";

    params.forEach(function (param) {
      if (param.key) {
        if (urlParams != "?") { urlParams += "&"; }
        urlParams += param.key + "=" + encodeURIComponent(param.value);
      }
    });

    if (urlParams == "?") { urlParams = ""; }
    return urlParams;
  }

  const formatHeaders = (headers) => {
    let formattedHeaders = {};

    headers.forEach(function(header) {
      if (header.key && header.value) {
        formattedHeaders[header.key] = header.value;
      }
    });

    return formattedHeaders;
  };

  const makeRequest = () => {
    let requestUrl = endpoint + serializeUrlParams(params);

    props.onSend(requestUrl, requestType, formatHeaders(headers), requestBody);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item xs={2} alignItems="flex-end" justify="flex-end">
          <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
              Action
            </InputLabel>
            <Select
              native
              value={requestType}
              onChange={updateRequestType()}
              labelWidth={labelWidth}
            >
              <option value={'get'}>GET</option>
              <option value={'post'}>POST</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <TextField
            onChange={updateEndpoint()}
            value={endpoint + serializeUrlParams(params)}
            fullWidth
            id="outlined-basic"
            label="Request Endpoint"
            variant="outlined"
          />
        </Grid>
        <Grid container item xs={2} alignItems="center" justify="center">
          <Button onClick={makeRequest} fullWidth size="large" variant="outlined" color="primary">
            Send
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid container item xs={6}>
          <Headers headers={headers} setHeaders={setHeaders} />
        </Grid>
        <Grid container item alignItems="flex-end" justify="flex-end" xs={6}>
          <Params params={params} setParams={setParams} />
        </Grid>
        { requestType == 'post' &&
          <Body requestBody={requestBody} setRequestBody={setRequestBody} />
        }
      </Grid>
      <br />
    </div>
  );
}

export default Request;
