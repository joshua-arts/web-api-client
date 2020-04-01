import React, { useEffect, useState } from "react";

import {
  makeStyles,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField
} from '@material-ui/core';

import Headers from './components/Headers';
import Params from './components/Params';
import Body from './components/Body';
import GraphQuery from './components/GraphQuery';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1, marginTop: '40px' },
}));

const sampleQuery = `query($number_of_repos: Int!){
  viewer {
    name
    repositories(last: $number_of_repos) {
      nodes {
        name
      }
    }
  }
}`

const sampleVariables = `{
  "number_of_repos": 3
}`

function Request(props) {
  const classes = useStyles();

  const [requestType, setRequestType] = useState('rest');
  const [action, setAction] = useState('get');
  const [endpoint, setEndpoint] = useState('https://api.github.com');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [requestBody, setRequestBody] = useState({ key: 'value' });
  const [graphQuery, setGraphQuery] = useState(sampleQuery);
  const [graphVariables, setGraphVariables] = useState(sampleVariables);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const updateAction = () => e => {
    setAction(e.target.value);
  };

  const updateEndpoint = () => e => {
    let endpoint = e.target.value;

    if (endpoint.includes("?")) {
      endpoint = endpoint.substr(0, endpoint.indexOf('?'));
    }

    setEndpoint(endpoint);
  }

  const buildEndpoint = () => {
    if (requestType === 'rest') {
      return endpoint + serializeUrlParams(params);
    } else {
      return endpoint;
    }
  }

  const serializeUrlParams = () => {
    let urlParams = "?";

    params.forEach(function (param) {
      if (param.key) {
        if (urlParams !== "?") { urlParams += "&"; }
        urlParams += param.key + "=" + encodeURIComponent(param.value);
      }
    });

    if (urlParams === "?") { urlParams = ""; }
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

    // Format the body based on requst type.
    let body = requestBody;
    if (requestType === 'graphql') {
      body = { query: graphQuery, variables: JSON.parse(graphVariables) }
    }

    props.onSend(requestUrl, action, formatHeaders(headers), body);
  };

  const requestTypeButtonStyle = (buttonType) => {
    if (buttonType === requestType) {
      return 'contained';
    } else {
      return 'outlined';
    }
  }

  const setRestMode = () => {
    setRequestType('rest');
    setAction('get');
    setEndpoint('https://api.github.com');
  }

  const setGraphQLMode = () => {
    setRequestType('graphql');
    setAction('post');
    setEndpoint('https://api.github.com/graphql');
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item xs={6} alignItems="center" justify="center">
          <Button onClick={() => setRestMode()} style={{width: '80%'}} variant={requestTypeButtonStyle('rest')} size="large" color="primary" className={classes.margin}>
            REST
          </Button>
        </Grid>
        <Grid container item xs={6} alignItems="center" justify="center">
          <Button onClick={() => setGraphQLMode()} style={{ width: '80%' }} variant={requestTypeButtonStyle('graphql')} size="large" color="primary" className={classes.margin}>
            GraphQL
          </Button>
        </Grid>
        <Divider />
        <Grid container item xs={2} alignItems="flex-end" justify="flex-end">
          <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
              Action
            </InputLabel>
            <Select
              disabled={ requestType === 'graphql' ? true : false }
              native
              value={action}
              onChange={updateAction()}
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
            value={buildEndpoint()}
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
        <Grid container item alignItems="flex-start" justify="flex-start" xs={6}>
          <Params params={params} setParams={setParams} disabled={requestType === 'graphql'} />
        </Grid>
        { action === 'post' && requestType === 'rest' &&
          <Body requestBody={requestBody} setRequestBody={setRequestBody} />
        }
        {requestType === 'graphql' &&
          <GraphQuery
            graphQuery={graphQuery}
            setGraphQuery={setGraphQuery}
            graphVariables={graphVariables}
            setGraphVariables={setGraphVariables} />
        }
      </Grid>
      <br />
    </div>
  );
}

export default Request;
