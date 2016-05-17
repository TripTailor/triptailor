import React from 'react';
import ReactDOM from 'react-dom';
import * as util from '../util';

class Tags extends React.Component {
  constructor() {
    super();

    var location = decodeURIComponent(util.getQueryValue("city")).split(",");
    this.state = {
      city: location[0],
      country: location.length > 1 ? location[1] : "",
      checkIn: new Date(util.getQueryValue("check-in")),
      checkOut: new Date(util.getQueryValue("check-out")),
      tags: ""
    };
  }
  render() {
    return (
      <form action="/search" method="get" className="tags-form">
        <InfoHeader city={this.state.city} country={this.state.country} checkIn={this.state.checkIn} checkOut={this.state.checkOut} />
        <div className="hint-copy">What are you looking for?</div>
        <TagsSelector />
        <div className="buttons-container">
          <a href="/" className="back-button">Back</a>
          <button type="submit" className="search-button">Search</button>
        </div>


        <input name="city" type="hidden" value={this.state.city} />
        <input name="country" type="hidden" value={this.state.country} />
        <input name="checkIn" type="hidden" value={this.state.checkIn} />
        <input name="checkOut" type="hidden" value={this.state.checkOut} />
        <input name="tags" type="hidden" value={this.state.tags} />
      </form>
    );
  }
}

const InfoHeader = (props) => {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return <div className="info-header">Great, you're going to <strong>{props.city}, {props.country}</strong>, from <strong>{months[props.checkIn.getMonth()]} {props.checkIn.getDate()}, {props.checkIn.getFullYear()}</strong> to <strong>{months[props.checkOut.getMonth()]} {props.checkOut.getDate()}, {props.checkOut.getFullYear()}</strong></div>
};

const TagsSelector = () => (
  <div></div>
);

ReactDOM.render(<Tags />, document.getElementById("content"));
