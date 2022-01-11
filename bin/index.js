#!/usr/bin/env node

const axios = require("axios");
const colors = require( "colors" );
const asciichart = require( "asciichart" );

const endpoint = (
  'https://api.coronavirus.data.gov.uk/v1/data?' +
  'filters=areaType=nation;areaName=england&' +
  'structure={"date":"date","newCases":"newCasesByPublishDate"}'
);

const MAX_RESULTS = 30;

const getData = async ( url ) => {

  const { data, status, statusText } = await axios.get(url, { timeout: 10000 });

  if ( status >= 400 )
    throw new Error(statusText);

  return data

};  // getData


const main = async () => {

  const result = await getData(endpoint);

  console.log( '--------------------------------------------------' )
  console.log( "Cases n England from " + result.data[MAX_RESULTS].date.green + " to " + result.data[0].date.green );
  var s0 = new Array( MAX_RESULTS );
  for( var i = 0; i < s0.length; i++ ){
    s0[i] = result.data[i].newCases / 10000;
  }

  var reversed = s0.reverse();
  console.log( asciichart.plot( reversed ) );
  console.log( 'Cases (x10,000)' )
  console.log( '--------------------------------------------------' )

  console.log( "Cases yesterday: " + result.data[0].newCases );
  console.log( "Data provided by UK Government" );
};  // main


main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
