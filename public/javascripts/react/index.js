import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import datepicker from 'jquery-ui';

var TIMEOUT = 200;

var dateToString = function(date) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return date.getDate() + " " +  months[date.getMonth()] + " " + date.getFullYear();
};
var dateToSubmit = function(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};
var formatComponent = function(component) {
  return component.trim().replace(", ", ",");
}

const Index = () => (
  <div className="index-container">
    <SearchForm />
    <Footer />
</div>
);

class SearchForm extends React.Component {
  constructor() {
    super();

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var toDate = new Date();
    toDate.setDate(toDate.getDate() + 4);

    this.state = {
      city: "",
      checkIn: dateToString(tomorrow),
      checkOut: dateToString(toDate),
      submitCity: "",
      submitCheckIn: dateToSubmit(tomorrow),
      submitCheckOut: dateToSubmit(toDate),
      cityHints: [],
      error: false
    };
  }
  updateCity(e) {
    this.setState({city: e.target.value, submitCity: formatComponent(e.target.value), error: false}, this.getCityHints.bind(this, e.target));
  }
  updateCheckIn(date) {
    this.setState({checkIn: date, submitCheckIn: dateToSubmit(new Date(date))});
  }
  updateCheckOut(date) {
    this.setState({checkOut: date, submitCheckOut: dateToSubmit(new Date(date))});
  }
  selectHint(e) {
    this.setState({city: $(e.target).text(), submitCity: formatComponent($(e.target).text()), cityHints: [], error: false});
  }
  handleBlur(e) {
    this.setState({cityHints: []});
  }
  handleKeyUp(e) {
    if(e.keyCode == 27)
      this.setState({cityHints: []});
  }
  validateForm(e) {
    if(this.state.submitCity == "") {
      this.setState({error: true});
      e.preventDefault();
    }
  }
  getCityHints(input) {
    var value = input.value;
    var url = jsRoutes.controllers.Assets.versioned("test/autocomplete.json").absoluteURL();
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
      <form action="/tags" method="get" className="search-form" onSubmit={this.validateForm.bind(this)}>
        <div className="title">TripTailor Hostels</div>
        <div className="subtitle">Imagine staying at the hostel you've been looking for</div>
        <div className="hint-copy">Where and when do you want to go?</div>
        <AutoCompleteInput city={this.state.city} updateCity={this.updateCity.bind(this)} submitCity={this.state.submitCity} hints={this.state.cityHints} selectHint={this.selectHint.bind(this)} handleBlur={this.handleBlur.bind(this)} handleKeyUp={this.handleKeyUp.bind(this)} error={this.state.error} />
        <DateInput checkIn={this.state.checkIn} updateCheckIn={this.updateCheckIn.bind(this)} checkOut={this.state.checkOut} updateCheckOut={this.updateCheckOut.bind(this)} submitCheckIn={this.state.submitCheckIn} submitCheckOut={this.state.submitCheckOut} cancelBlur={this.cancelBlur} />
        <button type="submit" className="next-button">Next</button>
      </form>
    );
  }
}

const AutoCompleteInput = (props) => (
  <div className="auto-complete-input-container">
    <input type="text" className={"auto-complete-input" + (props.error ? " error" : "")} autoComplete="off" placeholder="Pick a city" value={props.city} onChange={props.updateCity} onBlur={props.handleBlur} onKeyUp={props.handleKeyUp} />
    <AutoComplete hints={props.hints} selectHint={props.selectHint} cancelBlur={props.cancelBlur} />
    <input name="city" type="hidden" value={props.submitCity} />
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
    return <div key={i} className={className} onClick={props.selectHint} onMouseDown={cancelBlur}>{hint}</div>;
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
      dateFormat: "dd M yy",
      onSelect: function(date, inst) {
        var fromDate = new Date(date);
        var toDate = new Date($(this.toInput).datepicker("getDate"));
        var minDate = new Date(fromDate);
        minDate.setDate(fromDate.getDate() + 1);

        if(fromDate >= toDate)
          this.props.updateCheckOut(dateToString(minDate));

        $(this.toInput).datepicker("option", "minDate", minDate);

        this.props.updateCheckIn(date);
      }.bind(this)
    });

    $(this.toInput).datepicker({
      dateFormat: "dd M yy",
      onSelect: function(date, inst) {
        var fromDate = new Date($(this.fromInput).datepicker("getDate"));
        var toDate = new Date(date);

        this.props.updateCheckOut(date);
      }.bind(this)
    });

    var today = new Date(this.props.checkIn);
    today.setDate(today.getDate() - 1);
    $(this.fromInput).datepicker("option", "minDate", today);

    var minDate = new Date(this.props.checkIn);
    $(this.toInput).datepicker("option", "minDate", minDate);
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

const Footer = () => (
  <div className="footer">
    <a className="about-us">About Us</a>
  </div>
);

ReactDOM.render(<Index />, $("#content")[0]);
