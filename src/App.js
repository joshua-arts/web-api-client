import React, { useState } from 'react';
import axios from "axios";

import { Container, Divider } from '@material-ui/core';

import Request from './components/Request';
import Response from './components/Response';

import './App.css';

axios.interceptors.response.use(function (response) {
  response.config.metadata.endTime = new Date()
  response.responseTime = response.config.metadata.endTime - response.config.metadata.startTime
  return response;
}, function (error) {
  error.config.metadata.endTime = new Date();
  error.reponseTime = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

axios.interceptors.request.use(function (config) {
  config.metadata = { startTime: new Date() }
  return config;
}, function (error) {
  return Promise.reject(error);
});

function App() {
  const [request, setRequest] = useState();
  const [response, setResponse] = useState();

  const makeRequest = (endpoint, action, headers, body) => {
    // Add default headers.
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    console.log("Making request to " + endpoint);

    // Store the current request for easy re-sending.
    setRequest({
      action: action,
      endpoint: endpoint,
      headers: headers,
      body: body
    })

    // Use axios to make the request.
    axios({
      method: action,
      url: endpoint,
      headers: headers,
      data: body
    }).then(response => {
      setResponse({
        response: response.data,
        status: { code: response.status, text: response.statusText },
        metrics: { responseTime: response.responseTime }
      });
    }).catch(err => {
      if (err.response) {
        setResponse({
          response: err.response.data,
          status: { code: err.response.status, text: err.response.statusText },
          metrics: { responseTime: err.response.responseTime }
        });
      }
    });
  };

  const benchmarkRequest = async () => {
    let responseTime = 0;

    console.log("Making request to " + request.endpoint);

    responseTime = await axios({
      method: request.action,
      url: request.endpoint,
      headers: request.headers,
      data: request.body
    }).then(response => {
      return response.responseTime;
    });

    return responseTime;
  }

  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>

      <Container maxWidth='md'>
        <Request onSend={makeRequest} />
        <Divider />
        <Response response={response} benchmarkRequest={benchmarkRequest} />
      </Container>
    </div>
  );
}

export default App;
