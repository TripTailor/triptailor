import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import * as util from '../util';

class Results extends React.Component { 
  constructor() {
    super();
    this.city = decodeURIComponent(util.getQueryValue("city"));
    this.country = decodeURIComponent(util.getQueryValue("country"));
    this.checkIn = util.getQueryValue("check-in");
    this.checkOut = util.getQueryValue("check-out");
  }
  render() {
    return(
      <div>
        <Header city={this.city} country={this.country} checkIn={new Date(this.checkIn)} checkOut={new Date(this.checkOut)} />
        <Hostels />
      </div>
    );
  }
}

const Header = (props) => (
  <div className="container-fluid header">
    <div className="row">
      <div className="col-md-7">
        <div className="row">
          <div className="col-md-4 col-md-offset-3">
            <input type="text" className="city-input" readOnly value={props.city + ", " + props.country} />
          </div>
          <div className="col-md-5">
            <input type="text" className="check-in" readOnly value={util.dateToString(props.checkIn)} />
            <input type="text" className="check-out" readOnly value={util.dateToString(props.checkOut)} />
          </div>
        </div>
      </div>
    </div>
    <div className="row tags-row">
      <div className="col-md-7">
        <TagsInput />
      </div>
    </div>
  </div>
);

const TagsInput = (props) => {
  return (
    <div className="tags"></div>
  );
};

const Hostels = () => (
  <div className="container-fluid hostels">
    <div className="row">
      <div className="col-md-6"></div>
      <div className="col-md-6"></div>
    </div>
  </div>
);

ReactDOM.render(<Results />, $("#content")[0]);
