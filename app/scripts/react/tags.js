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
      tags: [],
      selectedTags: [],
      submitTags: ""
    };
  }
  componentWillMount() {
    this.getTagSuggestions();
  }
  selectTag(e) {
    this.setState({selectedTags: this.state.selectedTags.concat([e.target.textContent])});
  }
  removeTag(e) {
    var selectedTags = this.state.selectedTags.slice();
    selectedTags.splice(selectedTags.indexOf(e.target.textContent), 1);
    this.setState({selectedTags: selectedTags});
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
        <TagsSelector tags={this.state.tags} selectedTags={this.state.selectedTags} selectTag={this.selectTag.bind(this)} removeTag={this.removeTag.bind(this)} />
        <div className="buttons-container">
          <a href="/" className="back-button">Back</a>
          <button type="submit" className="search-button">Search</button>
        </div>


        <input name="city" type="hidden" value={this.state.city} />
        <input name="country" type="hidden" value={this.state.country} />
        <input name="checkIn" type="hidden" value={this.state.checkIn} />
        <input name="checkOut" type="hidden" value={this.state.checkOut} />
        <input name="tags" type="hidden" value={this.state.submitTags} />
      </form>
    );
  }
}

const InfoHeader = (props) => {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return <div className="info-header">Great, you're going to <strong>{props.city}, {props.country}</strong>, from <strong>{months[props.checkIn.getMonth()]} {props.checkIn.getDate()}, {props.checkIn.getFullYear()}</strong> to <strong>{months[props.checkOut.getMonth()]} {props.checkOut.getDate()}, {props.checkOut.getFullYear()}</strong></div>
};

class TagsSelector extends React.Component {
  constructor(props) {
    super(props);
  }
  moveSelector(e) {
    e.preventDefault();
    var slideTime = 400;
    switch(e.target) {
      case this.button1: $(this.selector).animate({left: 0}, slideTime); break;
      case this.button2: $(this.selector).animate({left: -460}, slideTime); break;
      case this.button3: $(this.selector).animate({left: -920}, slideTime); break;
    }
  }
  render() {
    var buildTag = (tag, i) => <span key={i} className="tag" onClick={this.props.selectTag}>{tag}</span>
    var panel1 = this.props.tags.slice(0, 15).map(buildTag);
    var panel2 = this.props.tags.slice(15, 30).map(buildTag);
    var panel3 = this.props.tags.slice(30, 45).map(buildTag);
    return (
      <div className="tag-selector-form">
        <div className="tag-selector-container">
          <div ref={(selector) => this.selector = selector} className="tag-selector">
            <div className="tag-selection-panel">{panel1}</div>
            {panel2.length > 0 ? <div className="tag-selection-panel panel2">{panel2}</div> : ""}
            {panel3.length > 0 ? <div className="tag-selection-panel panel3">{panel3}</div> : ""}
          </div>
        </div>

        <div className="selector-buttons">
          <button ref={(button) => this.button1 = button} className="selector-button" onClick={this.moveSelector.bind(this)}></button>
          {panel2.length > 0 ? <button ref={(button) => this.button2 = button} className="selector-button" onClick={this.moveSelector.bind(this)}></button> : ""}
          {panel3.length > 0 ? <button ref={(button) => this.button3 = button} className="selector-button" onClick={this.moveSelector.bind(this)}></button> : ""}
        </div>

        <SelectedTags tags={this.props.selectedTags} removeTag={this.props.removeTag} />
      </div>
    );
  }
};

const SelectedTags = (props) => {
  var tags = props.tags.map((tag, i) => (
    <span key={i} className="selected-tag" onClick={props.removeTag}>{tag} <span className="close">X</span></span>
  ));
  return <div className="selected-tags">{tags}</div>;
};

ReactDOM.render(<Tags />, document.getElementById("content"));
