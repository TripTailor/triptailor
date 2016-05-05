import React from 'react';
import ReactDOM from 'react-dom';

const Index = (props) => (
  <h1>Hello {props.message}</h1>
);

ReactDOM.render(<Index message="TripTailor" />, document.getElementById("content"));
