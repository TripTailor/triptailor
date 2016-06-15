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
      top: [],
      topTags: [],
      show: 0
    };
  }
  componentWillMount() {
    this.getHostels();
  }
  getHostels() {
    var url = jsRoutes.controllers.api.HostelsController.classify().url + "?location_id=" + this.locationId + util.arrayToQuery(this.tags, "tags");
    $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.getResultsReviews(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err);
      }
    });
  }
  getTopResults(results) {
    var topTags = [];
    var topRatings = this.tags.map((tag) =>  0);
    results.forEach((result) => {
      for(var i = 0; i < result.ctags.length; i++)
        if(result.ctags[i].rating > topRatings[i]) {
          topRatings[i] = result.ctags[i].rating;
          topTags[i] = result;
        }
    });
    var top = [results[0]];
    results.splice(0, 1);
    topTags.forEach((result) => {
      if(top.indexOf(result) < 0) {
        top.push(result)
        results.splice(results.indexOf(result), 1);
      }
    });
    this.setState({results: results, top: top, topTags: topRatings});
  }
  getResultsReviews(results) {
    var url = jsRoutes.controllers.api.ReviewsController.retrieveReviews().url + "?" + util.arrayToQuery(this.tags, "tags").substring(1) + util.arrayToQuery(results.map((result) => result.document.hostelId), "hostel_ids");
    $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      success: function(data) {
        for(var i = 0; i < results.length; i++)
          results[i]["reviews"] = data[results[i].document.hostelId];
        this.getTopResults(results);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err);
      }
    });
  }
  showMore() {
    this.setState({show: this.state.show + 6});
  }
  render() {
    return(
      <div className="results">
        <Header city={this.city} country={this.country} checkIn={util.queryDateToString(this.checkIn)} checkOut={util.queryDateToString(this.checkOut)} tags={this.tags} noResults={this.state.results.length} />
        <Hostels top={this.state.top} results={this.state.results} checkIn={this.checkIn} checkOut={this.checkOut} show={this.state.show} showMore={this.showMore.bind(this)} topTags={this.state.topTags} />
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
  var topRows = [];
  for(var i = 0; i < props.top.length; i+=2)
    topRows.push(<HostelsRow key={i / 2} col1={props.top[i]} col2={i + 1 < props.top.length ? props.top[i + 1] : null} checkIn={props.checkIn} checkOut={props.checkOut} top={i == 0} topTags={props.topTags} />);
  var rows = [];
  for(var i = 0; i < props.results.length && i < props.show; i+=2)
    rows.push(<HostelsRow key={i / 2} col1={props.results[i]} col2={i + 1 < props.results.length ? props.results[i + 1] : null} checkIn={props.checkIn} checkOut={props.checkOut} top={false} topTags={props.topTags} />);
  return (
    <div className="container-fluid">
      {topRows.length > 0 ?
      <div>
        <div className="hostels-container">{topRows}</div>
        {rows.length > 0 ? <div className="hostels-container">{rows}</div> : ""}
      </div> :
      <div className="hostels-container loader">
        <div><strong>Analysing Hostelworld reviews</strong></div>
        <img className="loader-gif" src={jsRoutes.controllers.Assets.versioned("images/loader.gif").url} />
      </div>}
      {props.show < props.results.length ? <button className="show-more" onClick={props.showMore}>Show more results</button> : ""}
    </div>
  );
};

const HostelsRow = (props) => (
  <div className="row">
    <div className="col-md-6 hostel-col"><Hostel name={props.col1.document.name} url={props.col1.document.url} price={props.col1.document.price} images={props.col1.document.images} ctags={props.col1.ctags} checkIn={props.checkIn} checkOut={props.checkOut} top={props.top} topTags={props.topTags} reviews={props.col1.reviews} /></div>
    {props.col2 ? <div className="col-md-6 hostel-col"><Hostel name={props.col2.document.name} url={props.col2.document.url} price={props.col2.document.price} images={props.col2.document.images} ctags={props.col2.ctags} checkIn={props.checkIn} checkOut={props.checkOut} top={false} topTags={props.topTags} reviews={props.col2.reviews} /></div> : ""}
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
    var label = this.props.top ? "Best match & best for " : "Best for ";
    for(var i = 0; i < this.props.ctags.length; i+=2)
      tagsRows.push(<TagsRow key={i / 2} tag1={this.props.ctags[i]} tag2={i + 1 < this.props.ctags.length ? this.props.ctags[i + 1] : null} />);
    for(var i = 0; i < this.props.ctags.length; i++)
      if(this.props.ctags[i].rating == this.props.topTags[i])
        label += this.props.ctags[i].name + " & ";
    label = label.substring(0, label.length - 3);

    return (
      <div className="hostel">
        <div className="hostel-image" style={this.props.images.length > 0 ? {backgroundImage: "url('" + this.props.images[this.state.selectedImage] + "')"} : ""}>
          {label != "Best f" ? <div className="hostel-label">{label}</div> : ""}
          {this.props.price ? <div className="hostel-price">€{this.props.price.toFixed(2)}</div> : ""}
          <a href={url} className="hostel-url" target="_blank" onClick={this.trackHostelClick.bind(this)}></a>
          {this.props.images.length > 1 ? <div ref={(button) => this.controllerLeft = button} className="image-controller-left" onClick={this.moveImage.bind(this)}><i className="fa fa-angle-left fa-2x" /></div> : ""}
          {this.props.images.length > 1 ? <div ref={(button) => this.controllerRight = button} className="image-controller-right" onClick={this.moveImage.bind(this)}><i className="fa fa-angle-right fa-2x" /></div> : ""}
          <a href={url} className="hostel-name" target="_blank">{this.props.name}</a>
        </div>
        <Reviews reviews={this.props.reviews} />
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

class Reviews extends React.Component {
  constructor () {
    super();

    this.state = {
      index: 0
    };
  }
  moveReview(e) {
    var target = e.target == this.controllerLeft || e.target == this.controllerRight ? e.target : e.target.parentNode;
    switch(target) {
      case this.controllerLeft: this.setState({index: this.state.index - 1 >= 0 ? this.state.index - 1 : this.props.reviews.length - 1}); break;
      case this.controllerRight: this.setState({index: this.state.index + 1 < this.props.reviews.length ? this.state.index + 1 : 0}); break;
    }
  }
  render() {
    var reviews = $.extend(true, {}, this.props.reviews);
    const updatePositions = (i, start) => {
      for(var j = i; j < reviews[this.state.index].tags.length; j++) {
        var positions = reviews[this.state.index].tags[j].positions;
        for(var k = 0; k < positions.length; k++) {
          if(start < positions[k].start) {
            positions[k].start += 13;
            positions[k].end += 13;
          }
        }
      }
    };

    var text = reviews[this.state.index].text;
    for(var i = 0; i < reviews[this.state.index].tags.length; i++) {
      var positions = reviews[this.state.index].tags[i].positions;
      for(var j = 0; j < positions.length; j++) {
        text = text.slice(0, positions[j].start) + "<span>" + text.slice(positions[j].start, positions[j].end) + "</span>" + text.slice(positions[j].end, text.length);
        updatePositions(i, positions[j].start);
      }
    }
    console.log(text);
    return (
      <div className="hostel-reviews">
        {this.props.reviews.length > 1 ? <div ref={(button) => this.controllerLeft = button} className="review-controller-left" onClick={this.moveReview.bind(this)}><i className="fa fa-angle-left fa-2x" /></div> : ""}
        {this.props.reviews.length > 1 ? <div ref={(button) => this.controllerRight = button} className="review-controller-right" onClick={this.moveReview.bind(this)}><i className="fa fa-angle-right fa-2x" /></div> : ""}
        <div className="review-container">
          <div className="hostel-reviews-text" dangerouslySetInnerHTML={{__html: text}}></div>
          <div className="hostel-reviews-author">— {this.props.reviews[this.state.index].reviewer}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Results />, $("#content")[0]);
