import React from 'react';
import ReactDOM from 'react-dom';

const Footer = () => (
  <div className="footer">
    <a href={jsRoutes.controllers.HomeController.aboutUs().url} className="about-us">About Us</a>
  </div>
);

ReactDOM.render(<Footer />, document.getElementById("footer"));
