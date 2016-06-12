import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import datepicker from 'jquery-ui';
import * as util from '../util';

var TIMEOUT = 200;

var dateToSubmit = function(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};

class Index extends React.Component {
  constructor() {
    super();

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var toDate = new Date();
    toDate.setDate(toDate.getDate() + 4);

    this.state = {
      city: "",
      checkIn: util.dateToString(tomorrow),
      checkOut: util.dateToString(toDate),
      location: "",
      locationId: -1,
      submitCheckIn: dateToSubmit(tomorrow),
      submitCheckOut: dateToSubmit(toDate),
      cityHints: [],
      error: false
    };
  }
  updateCity(e) {
    this.setState({city: e.target.value}, this.getCityHints.bind(this, e.target));
  }
  updateCheckIn(date) {
    this.setState({checkIn: date, submitCheckIn: dateToSubmit(new Date(date))});
  }
  updateCheckOut(date) {
    this.setState({checkOut: date, submitCheckOut: dateToSubmit(new Date(date))});
  }
  selectHint(hint) {
    this.setState({city: hint.city + ", " + hint.country, locationId: hint.id, location: hint.city + "," + hint.country, cityHints: [], error: false});
  }
  handleBlur(e) {
    this.setState({cityHints: []});
  }
  handleKeyUp(e) {
    if(e.keyCode == 27)
      this.setState({cityHints: []});
  }
  validateForm(e) {
    if(this.state.locationId == -1) {
      this.setState({error: true});
      e.preventDefault();
    }
  }
  getCityHints(input) {
    var value = input.value;
    var url = jsRoutes.controllers.api.LocationsController.retrieveLocationHints().url + "?q=" + value;
    setTimeout(function() {
      if(value.trim().length > 0 && $(input).is(":focus") && value == input.value) {
        $.ajax({
          url: url,
          dataType: "json",
          type: "GET",
          success: function(data) {
            this.setState({cityHints: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(url, status, err);
          }
        });
      }
      else
        this.setState({cityHints: []});
    }.bind(this), TIMEOUT);
  }
  render() {
    return (
      <div className="index-container">
       <form action={jsRoutes.controllers.HomeController.tags().url} method="get" className="search-form" onSubmit={this.validateForm.bind(this)}>
         <div className="title">TripTailor Hostels</div>
         <div className="subtitle">We read reviews for you, so you don't have to</div>
         <div className="hint-copy">Where and when do you want to go?</div>
         <AutoCompleteInput city={this.state.city} updateCity={this.updateCity.bind(this)} location={this.state.location} locationId={this.state.locationId} hints={this.state.cityHints} selectHint={this.selectHint.bind(this)} handleBlur={this.handleBlur.bind(this)} handleKeyUp={this.handleKeyUp.bind(this)} error={this.state.error} />
         <DateInput checkIn={this.state.checkIn} updateCheckIn={this.updateCheckIn.bind(this)} checkOut={this.state.checkOut} updateCheckOut={this.updateCheckOut.bind(this)} submitCheckIn={this.state.submitCheckIn} submitCheckOut={this.state.submitCheckOut} cancelBlur={this.cancelBlur} />
         <button type="submit" className="next-button">Next</button>
       </form>
     </div>
    );
  }
}

const AutoCompleteInput = (props) => (
  <div className="auto-complete-input-container">
    <input type="text" className={"auto-complete-input" + (props.error ? " error" : "")} autoComplete="off" placeholder="Pick a city" value={props.city} onChange={props.updateCity} onBlur={props.handleBlur} onKeyUp={props.handleKeyUp} />
    <AutoComplete hints={props.hints} selectHint={props.selectHint} cancelBlur={props.cancelBlur} />
    <input name="location-id" type="hidden" value={props.locationId} />
    <input name="location" type="hidden" value={props.location} />
  </div>
);

const AutoComplete = (props) => {
  var cancelBlur = (e) => {
    e.preventDefault();
  }
  var hints = $.map(props.hints, (hint, i) => {
    var className = "auto-complete-row";
    switch(i) {
      case 0: className += " first-row"; break;
      case props.hints.length - 1: className += " last-row"; break;
    };
    return <div key={i} className={className} onClick={() => props.selectHint(hint)} onMouseDown={cancelBlur}>{hint.city + ", " + hint.country}</div>;
  });
  return (
    <div className="auto-complete-container">
      <div className="auto-complete">{hints}</div>
    </div>
  );
}

class DateInput extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(this.fromInput).datepicker({
      dateFormat: "M dd, yy",
      minDate: 0,
      onSelect: function(date, inst) {
        var fromDate = new Date(date);
        var toDate = new Date($(this.toInput).datepicker("getDate"));
        var minDate = new Date(fromDate);
        minDate.setDate(fromDate.getDate() + 1);

        if(fromDate >= toDate)
          this.props.updateCheckOut(util.dateToString(minDate));

        $(this.toInput).datepicker("option", "minDate", minDate);

        this.props.updateCheckIn(date);
      }.bind(this)
    });

    $(this.toInput).datepicker({
      dateFormat: "M dd, yy",
      minDate: 2,
      onSelect: function(date, inst) {
        var fromDate = new Date($(this.fromInput).datepicker("getDate"));
        var toDate = new Date(date);

        this.props.updateCheckOut(date);
      }.bind(this)
    });
  }
  render() {
    return (
      <div className="dates-container">
        <input ref={(input) => this.fromInput = input} type="text" className="check-in-input" placeholder="Check in" readOnly value={this.props.checkIn} />
        <input ref={(input) => this.toInput = input} type="text" className="check-out-input" placeholder="Check out" readOnly value={this.props.checkOut} />
        <input name="check-in" type="hidden" value={this.props.submitCheckIn} />
        <input name="check-out" type="hidden" value={this.props.submitCheckOut} />
      </div>
    );
  }
}

ReactDOM.render(<Index />, $("#content")[0]);
