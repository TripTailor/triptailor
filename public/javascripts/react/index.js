import React from 'react';
import ReactDOM from 'react-dom';

const Index = () => (
  <div className="index-container">
    <SearchForm />
    <Footer />
</div>
);

const SearchForm = () => (
  <form action="/tags" method="get" className="search-form">
    <div className="title">TripTailor Hostels</div>
    <div className="subtitle">Imagine staying at the hostel you've been looking for</div>
    <div className="hint-copy">Where and when do you want to go?</div>
    <AutoCompleteInput />
    <DateInput />
    <button type="submit" className="next-button">Next</button>
  </form>
);

const AutoCompleteInput = (props) => (
  <div className="auto-complete-container">
    <input name="city" type="text" className="auto-complete-input" autocomplete="off" placeholder="Pick a city" />
  </div>
);

const DateInput = (props) => (
  <div className="dates-container">
    <input name="checkIn" type="text" className="check-in-input" placeholder="Check in" readOnly />
    <input name="checkOut" type="text" className="check-out-input" placeholder="Check out" readOnly />
  </div>
);

const Footer = () => (
  <div className="footer">
    <a className="about-us">About Us</a>
  </div>
);

ReactDOM.render(<Index />, document.getElementById("content"));
