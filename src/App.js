import React, { useState } from 'react';
import axios from "axios";

import { Container, Divider } from '@material-ui/core';

import Request from './components/Request';
import Response from './components/Response';

import './App.css';

function App() {
  const [response, setResponse] = useState();
  const [status, setStatus] = useState({});

  const makeRequest = (endpoint, requestType, headers, body) => {
    // Add default headers.
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    // Use axios to make the request.
    axios({
      method: requestType,
      url: endpoint,
      headers: headers,
      data: body
    }).then(response => {
      console.log(response);
      setResponse(response.data);
      setStatus({ code: response.status, text: response.statusText });
    }).catch(err => {
      if (err.response) {
        setResponse(err.response.data);
        setStatus({ code: err.response.status, text: err.response.statusText });
      }
    });
  };

  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>

      <Container maxWidth='md'>
        <Request onSend={makeRequest} />
        <Divider />
        <Response response={response} status={status} />
      </Container>
    </div>
  );
}

export default App;
