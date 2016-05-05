import React from 'react';
import ReactDOM from 'react-dom';

const Header = () => (
  <div>
    <span className="brand">TripTailor Hostels</span>
  </div>
);

ReactDOM.render(<Header />, document.getElementById("header"));
