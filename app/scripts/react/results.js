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
  <div className="container-fluid header">
    <div className="row">
      <div className="col-md-7">
        <div className="row">
          <div className="col-md-4 col-md-offset-3">
            <input type="text" className="city-input" readOnly />
          </div>
          <div className="col-md-5">
            <input type="text" className="check-in" readOnly />
            <input type="text" className="check-out" readOnly />
          </div>
        </div>
      </div>
    </div>
    <div className="row tags-row">
      <div className="col-md-7">
        <div className="tags"></div>
      </div>
    </div>
  </div>
);

const Hostels = () => (
  <div className="container-fluid hostels">
    <div className="row">
      <div className="col-md-6"></div>
      <div className="col-md-6"></div>
    </div>
  </div>
);

ReactDOM.render(<Results />, $("#content")[0]);
