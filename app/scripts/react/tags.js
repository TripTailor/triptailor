import React from 'react';
import ReactDOM from 'react-dom';
import * as util from '../util';
import $ from 'jquery';

class Tags extends React.Component {
  constructor() {
    super();

    this.locationId = util.getQueryValue("location-id");
    this.location = decodeURIComponent(util.getQueryValue("location")).split(",");
    this.checkIn = util.getQueryValue("check-in");
    this.checkOut = util.getQueryValue("check-out");
    this.state = {
      tags: [],
      selectedTags: [],
      submitTags: ""
    };
  }
  componentWillMount() {
    this.getTagSuggestions();
  }
  selectTag(e) {
    var tagIndex = this.state.selectedTags.indexOf(e.target.textContent);
    if(tagIndex == -1)
      var selectedTags = this.state.selectedTags.concat([e.target.textContent])
    else
      var selectedTags = this.state.selectedTags.slice(0, tagIndex).concat(this.state.selectedTags.slice(tagIndex + 1, this.state.selectedTags.length));
    this.setState({selectedTags: selectedTags, submitTags: util.arrayToString(selectedTags)});
  }
  removeTag(e) {
    var selectedTags = this.state.selectedTags.slice();
    selectedTags.splice(selectedTags.indexOf(e.target.textContent), 1);
    this.setState({selectedTags: selectedTags, submitTags: util.arrayToString(selectedTags)});
  }
  getTagSuggestions() {
    var url = jsRoutes.controllers.api.TagsController.mostFrequentTags().url + "?id=" + this.locationId;
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
  trackSearch() {
    if(mixpanel)
      mixpanel.track("Search", {
        "locationId": this.locationId,
        "city": this.location[0],
        "country": this.location[1],
        "checkIn": this.checkInt,
        "checkOut": this.checkOut,
        "tags": this.state.selectedTags
      });
  }
  render() {
    return (
      <form action={jsRoutes.controllers.HomeController.search().url} method="get" className="tags-form" onSubmit={this.trackSearch.bind(this)}>
        <InfoHeader city={this.location[0]} country={this.location[1]} checkIn={util.queryDateToString(this.checkIn)} checkOut={util.queryDateToString(this.checkOut)} />
        <div className="hint-copy">What are you looking for?</div>
        <div className="help-copy">Select one or more keywords</div>
        <TagsSelector tags={this.state.tags} selectedTags={this.state.selectedTags} selectTag={this.selectTag.bind(this)} removeTag={this.removeTag.bind(this)} />
        <div className="buttons-container">
          <a href="/" className="back-button">Back</a>
          <button type="submit" className="search-button">Search</button>
        </div>

        <input name="location-id" type="hidden" value={this.locationId} />
        <input name="city" type="hidden" value={this.location[0]} />
        <input name="country" type="hidden" value={this.location[1]} />
        <input name="check-in" type="hidden" value={this.checkIn} />
        <input name="check-out" type="hidden" value={this.checkOut} />
        {this.state.selectedTags.length > 0 ? <input name="tags" type="hidden" value={this.state.submitTags} /> : ""}
      </form>
    );
  }
}

const InfoHeader = (props) => (
  <div className="info-header">Great, you're going to <strong>{props.city}, {props.country}</strong>, from <strong>{util.dateToString(props.checkIn)}</strong> to <strong>{util.dateToString(props.checkOut)}</strong></div>
);

class TagsSelector extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(this.button1).addClass("selected");
  }
  moveSelector(e) {
    e.preventDefault();

    $(this.button1).removeClass("selected");
    $(this.button2).removeClass("selected");
    $(this.button3).removeClass("selected");

    var slideTime = 400;
    switch(e.target) {
      case this.button1: $(this.selector).animate({left: 0}, slideTime); $(this.button1).addClass("selected"); break;
      case this.button2: $(this.selector).animate({left: -460}, slideTime); $(this.button2).addClass("selected"); break;
      case this.button3: $(this.selector).animate({left: -920}, slideTime); $(this.button3).addClass("selected"); break;
    }
  }
  render() {
    var buildTag = (tag, i) => <span key={i} className={"tag" + (this.props.selectedTags.indexOf(tag.name) != -1 ? " selected" : "")} onClick={this.props.selectTag}>{tag.name}</span>
    var offset = $(window).width() < 510 ? 10: 15;
    var panel1 = this.props.tags.slice(0, offset).map(buildTag);
    var panel2 = this.props.tags.slice(offset, offset * 2).map(buildTag);
    var panel3 = this.props.tags.slice(offset * 2, offset * 3).map(buildTag);
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
    <span key={i} className="selected-tag" onClick={props.removeTag}>{tag} <span className="close">x</span></span>
  ));
  return <div className="selected-tags">{tags}</div>;
};

ReactDOM.render(<Tags />, document.getElementById("content"));
