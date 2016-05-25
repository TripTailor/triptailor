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
    this.tags = util.getQueryValue("tags").split("-");
    this.state = {
      results: []
    };
  }
  componentWillMount() {
    this.getHostels();
  }
  getHostels() {
    var url = jsRoutes.controllers.Assets.versioned("test/hostels.json").absoluteURL();
    $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.setState({results: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err);
      }
    });
  }
  render() {
    return(
      <div>
        <Header city={this.city} country={this.country} checkIn={new Date(this.checkIn)} checkOut={new Date(this.checkOut)} tags={this.tags} noResults={this.state.results.length} />
        <Hostels results={this.state.results} />
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
        <TagsInput tags={props.tags} />
      </div>
      <div className="col-md-5 no-results-container">
        <div className="no-results">
          <div>Results</div>
          <div><strong>{props.noResults}</strong></div>
        </div>
      </div>
    </div>
  </div>
);

const TagsInput = (props) => {
  var tags = props.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>);
  return (
    <div className="tags">{tags}</div>
  );
};

const Hostels = (props) => {
  var rows = [];
  for(var i = 0; i < props.results.length; i+=2)
  rows.push(<HostelsRow key={i / 2} col1={props.results[i].document.model} col2={i + 1 < props.results.length ? props.results[i + 1].document.model : null} />);
  return(
    <div className="container-fluid hostels">{rows}</div>
  );
};

const HostelsRow = (props) => (
  <div className="row">
    <div className="col-md-6 hostel-col-left"><Hostel name={props.col1.name} image={props.col1.images[0]} /></div>
    {props.col2 ? <div className="col-md-6 hostel-col-right"><Hostel name={props.col2.name} image={props.col2.images[0]} /></div> : ""}
  </div>
);

const Hostel = (props) => (
  <div className="hostel">
    <div className="hostel-image" style={{backgroundImage: "url('" + props.image + "')"}}>
      <div className="hostel-name">{props.name}</div>
    </div>
    <div className="container-fluid hostel-tags">
      <div className="hostel-tags-copy">See what people are saying:</div>
      <div className="row">
        <div className="col-md-6">location</div>
        <div className="col-md-6">party</div>
      </div>
      <div className="row">
        <div className="col-md-6">food</div>
      </div>
    </div>
    <div className="hostel-reviews">
      <div className="hostel-reviews-text">The  location  of this hostel is the best; just 3 blocks walking from Empire State and other stuff.</div>
      <div className="hostel-reviews-author">— Thomas Bangalter</div>
    </div>
  </div>
);

ReactDOM.render(<Results />, $("#content")[0]);
