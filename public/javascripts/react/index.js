import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const Index = (props) => {
  return <h1>Hello {props.message}</h1>
};

ReactDOM.render(<Index message="TripTailor" />, $("#content")[0]);
