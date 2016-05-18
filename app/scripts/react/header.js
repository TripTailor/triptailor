import React from 'react';
import ReactDOM from 'react-dom';

const Header = () => (
  <div className="navbar">
    <a href="/" className="brand">TripTailor Hostels</a>
  </div>
);

ReactDOM.render(<Header />, document.getElementById("header"));
