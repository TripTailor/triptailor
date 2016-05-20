import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const Results = () => (
  <div>
    <Header />
    <Hostels />
  </div>
);

const Header = () => (
  <div>
    
  </div>
);

const Hostels = () => (
  <div></div>
);

ReactDOM.render(<Results />, $("#content")[0]);
