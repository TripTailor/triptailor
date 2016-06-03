import React from 'react';
import ReactDOM from 'react-dom';

const AboutUs = () => (
  <div>
    <Header />
    <Content />
  </div>
);

const Header = () => (
  <div className="container-fluid header">
    <div className="row">
      <div className="col-xs-5 col-xs-offset-7">
        <div>Share</div>
        <div className="addthis_sharing_toolbox"></div>
      </div>
    </div>
  </div>
);

const Content = () => (
  <div className="container-fluid main-content">
    <div className="row">
      <About />
    </div>
  </div>
);

const About = () => (
  <div className="col-md-8">
    <AboutTripTailor />
    <AboutTeam />
  </div>
);

const AboutTripTailor = () => (
  <div className="about-triptailor">
    <div className="copy-subheader">About Us</div>
    <div className="copy-header"><strong className="ubuntu">TripTailor</strong></div>
    <div className="copy">
      <p>TripTailor is a group of passionate travelers. We travel to experience other cultures, to better our understanding of the world and because we enjoy the act of discovering. We also love technology. We understand how technology can improve people's lives and make them live more plentiful. Great technology works like magic.</p>
      <p>Because we are constantly traveling, we know the hassles of travel planning. Finding a unique, curated experience is very hard. We are using sophisticated Machine Learning algorithms to solve this problem. Our mission is to make travel planning seamless, rich and fun. Hostels is just the perfect beginning to a great journey. Welcome aboard!</p>
    </div>
  </div>
);

const AboutTeam = () => (
  <div className="about-team">
    <div className="copy-subheader team-subheader">Who We Are</div>
    <div className="copy-header">Our <strong className="ubuntu">Team</strong></div>
    <div className="row">
      <div className="col-md-4 founder-col"><img src={jsRoutes.controllers.Assets.versioned("images/luis.png").url} className="founder-picture" /></div>
      <div className="col-md-8 founder-col">
        <div className="founder-name">Luis Galeana</div>
        <div className="founder-subheader">Software Engineer & Data Scientist</div>
        <div className="founder-copy">Luis is a Software Engineer from Mexico. He loves exploring new technologies and has plenty of experience with it. He believes that Machine Learning is the new new thing that will disrupt the way we interact with the world. He is constantly looking for House Music venues and Craft Beer.</div>
      </div>
    </div>
  </div>
);

ReactDOM.render(<AboutUs />, document.getElementById("content"));
