import React, { useState } from "react";

import { makeStyles, Button, Card, CardContent, Grid, Paper, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, TextField, Typography } from '@material-ui/core';
import classNames from 'classnames';
import ReactJson from 'react-json-view';
import { Label, LineChart, Line, Legend, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import { CSVLink } from "react-csv";

import sleepingCat from './sleeping_cat.png';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1, marginTop: '30px' },
  cat: { flexGrow: 1, marginTop: '60px' },
  success: { color: '#4caf50' },
  failure: { color: '#f44336' },
  title: { fontSize: 14 },
  pos: { marginBottom: 12 },
  marginFix: { marginBlockStart: 0, marginBlockEnd: 0 },
}));

var benchmark = null;

function Response(props) {
  const classes = useStyles();
  const [benchmarking, setBenchmarking] = useState(false)
  const [chartData, setChartData] = useState([]);
  const [benchmarkInterval, setBenchmarkInterval] = useState(10)

  const beginBenchmark = () => {
    setBenchmarking(true);
    benchmark = setInterval(makeRequest, benchmarkInterval * 1000);
  }

  const stopBenchmark = () => {
    clearInterval(benchmark);
    setBenchmarking(false);
    setChartData([]);
  }

  const averageResponseTime = (chartData) => {
    if(chartData.length === 0) {
      return 0;
    }

    var sum = 0;

    for (var i = 0; i < chartData.length; i++) {
      sum += chartData[i].responseTime;
    }

    return Math.round((sum / chartData.length) * 100) / 100
  }

  const makeRequest = async () => {
    let responseTime = await props.benchmarkRequest();

    setChartData(chartData => [...chartData, {
      responseTime: responseTime
    }]);
  };

  const updateInterval = () => e => {
    setBenchmarkInterval(e.target.value);
  };

  if (props.response == null) {
    return (
      <div className={classes.cat}>
        <Grid container spacing={3}>
          <Grid container item alignItems='center' justify="center" xs={12}>
            <img src={sleepingCat} width={300} />
          </Grid>
        </Grid>
      </div>
    );
  }

  let disableBenchmarking = true;

  let statusClass = classes.failure;
  let status = props.response.status;

  if (status.code >= 200 && status.code < 300) {
    disableBenchmarking = false;
    statusClass = classes.success;
  }

  if (status.text && status.text.toLowerCase() === 'ok') {
    status.text = 'Success';
  }

  var responseContent;
  var cardContent;

  if(!benchmarking) {
    responseContent = (
      <Grid container item xs={9}>
        <ReactJson src={props.response} collapsed={3} />
      </Grid>
    );

    cardContent = (
      <CardContent>
        <TextField
          id="outlined-number"
          label="Interval (seconds)"
          type="number"
          size="small"
          defaultValue={benchmarkInterval}
          variant="outlined"
          onChange={updateInterval()}
        />
        <Button onClick={beginBenchmark} fullWidth variant="outlined" color="primary" disabled={disableBenchmarking}>
          Benchmark
        </Button>
        <hr />
        <Typography className={classNames(classes.title, classes.pos)} color="textSecondary" gutterBottom>
          Request info
        </Typography>
        <Typography className={classNames(statusClass, classes.marginFix)} variant="h3" component="h5">
          {status.code}
        </Typography>
        <Typography className={classNames(statusClass, classes.marginFix)} color="textSecondary" component="h5">
          {status.text}
        </Typography>
        <br />
        <Typography className={classes.marginFix} variant="h3" color="textSecondary" component="h5">
          {props.response.metrics.responseTime}<span style={{ fontSize: 15 }}>ms</span>
        </Typography>
        <Typography className={classes.marginFix} color="textSecondary" component="h5">
          Response time
        </Typography>
      </CardContent>
    );
  } else {
    responseContent = (
      <Grid container item xs={9}>
        <LineChart width={600} height={300} data={chartData} margin={{ top: 5, right: 20, bottom: 15, left: 0 }}>
          <Line name="Response time" type="monotone" dataKey="responseTime" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis>
            <Label value="Request trial" offset={0} position="bottom" />
          </XAxis>
          <YAxis padding={{ top: 30 }} interval="preserveEnd" />
          <Legend verticalAlign="top" height={36} />
          <Tooltip />
        </LineChart>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Trial</TableCell>
                <TableCell align="right">Response time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.reverse().map((row, i) => (
              <TableRow key={`table-row-${i}`}>
                  <TableCell align="left">{chartData.length - i}</TableCell>
                  <TableCell align="right">{row.responseTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );

    var csvChartData = chartData.reverse().map((row, i) => (
      { trial: chartData.length - i, responseTime: row.responseTime }
    ));

    cardContent = (
      <CardContent>
        <Button onClick={stopBenchmark} fullWidth variant="outlined" color="primary">
          Stop
        </Button>
        <hr />
        <Typography className={classNames(classes.title, classes.pos)} color="textSecondary" gutterBottom>
          Request info
        </Typography>
        <Typography className={classes.marginFix} color="textSecondary" variant="h3" component="h5">
          {chartData.length}
        </Typography>
        <Typography className={classes.marginFix} color="textSecondary" component="h5">
          Trials
        </Typography>
        <br />
        <Typography className={classes.marginFix} variant="h3" color="textSecondary" component="h5">
          {averageResponseTime(chartData)}<span style={{ fontSize: 15 }}>ms</span>
        </Typography>
        <Typography className={classes.marginFix} color="textSecondary" component="h5">
          Average response time
        </Typography>
        <br />
        <CSVLink data={csvChartData} filename={"data.csv"}>Download as CSV</CSVLink>
      </CardContent>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        { responseContent }
        <Grid container item xs={3}>
          <Card className={classes.root}>
            { cardContent }
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Response;
