import React from 'react';
import ReactDOM from 'react-dom';

const Index = () => (
  <SearchForm />
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
    <input type="text" className="auto-complete-input" autocomplete="off" placeholder="Pick a city" />
  </div>
);

const DateInput = (props) => (
  <div className="date-input-container">
    <input type="text" className="check-in-input" placeholder="Check in" readonly />
    <input type="text" className="check-out-input" placeholder="Check out" readonly />
  </div>
);

ReactDOM.render(<Index />, document.getElementById("content"));
