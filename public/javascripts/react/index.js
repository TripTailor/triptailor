import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import datepicker from 'jquery-ui';

const Index = () => (
  <div className="index-container">
    <SearchForm />
    <Footer />
</div>
);

class SearchForm extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <form action="/tags" method="get" className="search-form">
        <div className="title">TripTailor Hostels</div>
        <div className="subtitle">Imagine staying at the hostel you've been looking for</div>
        <div className="hint-copy">Where and when do you want to go?</div>
        <AutoCompleteInput />
        <DateInput />
        <button type="submit" className="next-button">Next</button>
      </form>
    );
  }
}

const AutoCompleteInput = (props) => (
  <div className="auto-complete-container">
    <input name="city" type="text" className="auto-complete-input" autocomplete="off" placeholder="Pick a city" />
  </div>
);

class DateInput extends React.Component {
  constructor() {
    super();
  }
  fromDatepicker(input) {
    this.fromInput = input;
  }
  toDatepicker(input) {
    this.toInput = input;
  }
  componentDidMount() {
    $(this.fromInput).datepicker({
      dateFormat: "dd M yy",
      onSelect: function(date, inst) {
        var fromDate = new Date(date);
        var toDate = new Date($(this.toInput).datepicker("getDate"));
        var limitDate = new Date(fromDate.getDate() + 1);

        if(fromDate >= toDate)
          $(this.toInput).datepicker("setDate", toDate);

        $(this.toInput).datepicker("option", "minDate", limitDate);
      }
    });

    $(this.toInput).datepicker({
      dateFormat: "dd M yy",
      onSelect: function(date, inst) {
        var fromDate = new Date($(this.fromInput).datepicker("getDate"));
        var toDate = new Date(date);
      }
    });

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $(this.fromInput).datepicker("setDate", tomorrow);
    var today = new Date();
    $(this.fromInput).datepicker("option", "minDate", today);

    var toDate = new Date();
    toDate.setDate(toDate.getDate() + 4);
    $(this.toInput).datepicker("setDate", toDate);
    var minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    $(this.toInput).datepicker("option", "minDate", minDate);
  }
  render() {
    return (
      <div className="dates-container">
        <input ref={this.fromDatepicker.bind(this)} name="checkIn" type="text" className="check-in-input" placeholder="Check in" readOnly />
        <input ref={this.toDatepicker.bind(this)} name="checkOut" type="text" className="check-out-input" placeholder="Check out" readOnly />
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
