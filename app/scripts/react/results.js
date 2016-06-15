import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import * as util from '../util';

class Results extends React.Component { 
  constructor() {
    super();
    this.locationId = util.getQueryValue("location-id");
    this.city = decodeURIComponent(util.getQueryValue("city"));
    this.country = decodeURIComponent(util.getQueryValue("country"));
    this.checkIn = util.getQueryValue("check-in");
    this.checkOut = util.getQueryValue("check-out");
    this.tags = util.getQueryValue("tags").split("-");
    var emptyIndex = this.tags.indexOf("");
    if(emptyIndex >= 0)
      this.tags.splice(emptyIndex, 1);
    this.state = {
      results: [],
      top: []
    };
  }
  componentWillMount() {
    this.getHostels();
  }
  getHostels() {
    var url = jsRoutes.controllers.api.HostelsController.classify().url + "?location_id=" + this.locationId + util.tagsToQuery(this.tags);
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
  getTopResults() {
    var top = [];
    var topTags = this.tags.map((tag) => 0);
    this.state.results.forEach((result, i) => {
      for(var j = 0; j < result.ctags.length; j++)
        if(result.ctags[j].rating > topTags[j]) {
          topTags[j] = result.ctags[j].rating;
          top[j] = i;
        }
    });
    this.setState({top: top});
  }
  render() {
    return(
      <div className="results">
        <Header city={this.city} country={this.country} checkIn={util.queryDateToString(this.checkIn)} checkOut={util.queryDateToString(this.checkOut)} tags={this.tags} noResults={this.state.results.length} />
        <Hostels results={this.state.results} checkIn={this.checkIn} checkOut={this.checkOut} />
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
          <div className="col-md-5 check-in-col">
            <input type="text" className="check-in" readOnly value={util.dateToString(props.checkIn)} />
            <input type="text" className="check-out" readOnly value={util.dateToString(props.checkOut)} />
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-7">
        <TagsInput tags={props.tags} />
      </div>
      <div className="col-md-5">
        <div className="row">
          <div className="col-xs-5 header-extra">
            <div>Results</div>
            <div><strong>{props.noResults}</strong></div>
          </div>
          <div className="col-xs-7 header-extra">
            <div>Share</div>
            <div className="addthis_sharing_toolbox"></div>
          </div>
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
    rows.push(<HostelsRow key={i / 2} col1={props.results[i]} col2={i + 1 < props.results.length ? props.results[i + 1] : null} checkIn={props.checkIn} checkOut={props.checkOut} />);
  return (
    <div>
    {rows.length > 0 ?
    <div className="container-fluid hostels-container">{rows}</div> :
    <div className="container-fluid hostels-container loader">
      <div><strong>Analysing Hostelworld reviews</strong></div>
      <img className="loader-gif" src={jsRoutes.controllers.Assets.versioned("images/loader.gif").url} />
    </div>}
    </div>
  );
};

const HostelsRow = (props) => (
  <div className="row">
    <div className="col-md-6 hostel-col"><Hostel name={props.col1.document.name} url={props.col1.document.url} price={props.col1.document.price} images={props.col1.document.images} ctags={props.col1.ctags} checkIn={props.checkIn} checkOut={props.checkOut} /></div>
    {props.col2 ? <div className="col-md-6 hostel-col"><Hostel name={props.col2.document.name} url={props.col2.document.url} price={props.col2.document.price} images={props.col2.document.images} ctags={props.col2.ctags} checkIn={props.checkIn} checkOut={props.checkOut} /></div> : ""}
  </div>
);

class Hostel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: 0
    };
  }
  moveImage(e) {
    var target = e.target == this.controllerLeft || e.target == this.controllerRight ? e.target : e.target.parentNode;
    switch(target) {
      case this.controllerLeft: this.setState({selectedImage: this.state.selectedImage - 1 >= 0 ? this.state.selectedImage - 1 : this.props.images.length - 1}); break;
      case this.controllerRight: this.setState({selectedImage: this.state.selectedImage + 1 < this.props.images.length ? this.state.selectedImage + 1 : 0}); break;
    }
  }
  trackHostelClick() {
    if(mixpanel)
      mixpanel.track("Hostel Click", {
        "tags": this.props.ctags,
        "hostelId": this.props.id,
        "hostel": this.props.name
      });
  }
  render() {
    var url = this.props.url + "?dateFrom=" + this.props.checkIn + "&dateTo=" + this.props.checkOut + "&number_of_guests=1";

    var tagsRows = [];
    for(var i = 0; i < this.props.ctags.length; i+=2)
      tagsRows.push(<TagsRow key={i / 2} tag1={this.props.ctags[i]} tag2={i + 1 < this.props.ctags.length ? this.props.ctags[i + 1] : null} />);

      return (
      <div className="hostel">
        <div className="hostel-image" style={this.props.images.length > 0 ? {backgroundImage: "url('" + this.props.images[this.state.selectedImage] + "')"} : ""}>
          {this.props.price ? <div className="hostel-price">€{this.props.price.toFixed(2)}</div> : ""}
          <a href={url} className="hostel-url" target="_blank" onClick={this.trackHostelClick.bind(this)}></a>
          {this.props.images.length > 1 ? <div ref={(button) => this.controllerLeft = button} className="image-controller-left" onClick={this.moveImage.bind(this)}><i className="fa fa-angle-left fa-2x" /></div> : ""}
          {this.props.images.length > 1 ? <div ref={(button) => this.controllerRight = button} className="image-controller-right" onClick={this.moveImage.bind(this)}><i className="fa fa-angle-right fa-2x" /></div> : ""}
          <a href={url} className="hostel-name" target="_blank">{this.props.name}</a>
        </div>
        <div className="container-fluid hostel-tags">
          <div className="hostel-tags-copy">{this.props.ctags.length > 0 ? "This is what the reviews say:" : "Pick some keywords to see what the reviews say"}</div>
          {tagsRows}
        </div>
        {/* <Reviews /> */}
      </div>
    );
  }
}

const TagsRow = (props) => (
  <div className="row">
    <TagColumn tag={props.tag1.name} scaledRating={props.tag1.scaledRating} />
    {props.tag2 ? <TagColumn tag={props.tag2.name} scaledRating={props.tag2.scaledRating} /> : ""}
  </div>
);

const TagColumn = (props) => {
  var scaledRating = Math.ceil(props.scaledRating) - 1;
  if(scaledRating < 0)
    scaledRating = 0;
  if(scaledRating > 5)
    scaledRating = 5;

  var hearts = [];
  for(var i = 0; i < scaledRating; i++)
    hearts.push(<i key={i} className="fa fa-heart fa-1" />);
  for(var i = 0; i < (5 - scaledRating); i++)
    hearts.push(<i key={i + scaledRating} className="fa fa-heart-o fa-1" />);

  return (
    <div className="col-md-6 hostel-tag-col">
      <div className="row">
        <div className="col-xs-5">{props.tag}</div>
        <div className="col-xs-7">{hearts}</div>
      </div>
    </div>
  );
};

const Reviews = () => (
  <div className="hostel-reviews">
    <div className="hostel-reviews-text">The  location  of this hostel is the best; just 3 blocks walking from Empire State and other stuff.</div>
    <div className="hostel-reviews-author">— Thomas Bangalter</div>
  </div>
);

ReactDOM.render(<Results />, $("#content")[0]);
