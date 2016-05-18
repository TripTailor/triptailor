import React from 'react';
import ReactDOM from 'react-dom';
import * as util from '../util';
import $ from 'jquery';

class Tags extends React.Component {
  constructor() {
    super();

    var location = decodeURIComponent(util.getQueryValue("city")).split(",");
    this.state = {
      city: location[0],
      country: location.length > 1 ? location[1] : "",
      checkIn: new Date(util.getQueryValue("check-in")),
      checkOut: new Date(util.getQueryValue("check-out")),
      tags: []
    };
  }
  componentWillMount() {
    this.getTagSuggestions();
  }
  getTagSuggestions() {
    var url = jsRoutes.controllers.Assets.versioned("test/tags.json").absoluteURL();
    $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.setState({tags: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err);
      }
    });
  }
  render() {
    return (
      <form action="/search" method="get" className="tags-form">
        <InfoHeader city={this.state.city} country={this.state.country} checkIn={this.state.checkIn} checkOut={this.state.checkOut} />
        <div className="hint-copy">What are you looking for?</div>
        <div className="help-copy">Select one or more keywords</div>
        <TagsSelector tags={this.state.tags} />
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

const TagsSelector = (props) => {
  var buildTag = (tag, i) => <span key={i} className="tag">{tag}</span>
  var panel1 = props.tags.slice(0, 15).map(buildTag);
  var panel2 = props.tags.slice(15, 30).map(buildTag);
  var panel3 = props.tags.slice(30, 45).map(buildTag);
  return (
    <div className="tag-selector-container">
      <div className="tag-selector">
        <div className="tag-selection-panel">{panel1}</div>
        {panel2.length > 0 ? <div className="tag-selection-panel">{panel2}</div> : ""}
        {panel3.length > 0 ? <div className="tag-selection-panel">{panel3}</div> : ""}
      </div>
    </div>
  );
};

ReactDOM.render(<Tags />, document.getElementById("content"));
