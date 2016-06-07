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
      <div className="col-md-4 founder-picture-col"><img src={jsRoutes.controllers.Assets.versioned("images/luis.png").url} className="founder-picture" /></div>
      <div className="col-md-8 founder-col">
        <div className="founder-name">Luis Galeana</div>
        <div className="founder-subheader">Software Engineer & Data Scientist</div>
        <div className="founder-copy">Luis is a Software Engineer from Mexico. He loves exploring new technologies and has plenty of experience with it. He believes that Machine Learning is the new new thing that will disrupt the way we interact with the world. He is constantly looking for House Music venues and Craft Beer.</div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4 founder-picture-col"><img src={jsRoutes.controllers.Assets.versioned("images/orianne.jpg").url} className="founder-picture" /></div>
      <div className="col-md-8 founder-col">
        <div className="founder-name">Orianne Gambino</div>
        <div className="founder-subheader">Business Developer</div>
        <div className="founder-copy">Orianne is a French business developer that loves to come up with original solutions. Her passion for discovering the world combined with her extensive experience in the hospitality industry gives her a great understanding of travelers' hassles. Always traveling, she loves to settle in colorful destinations and explore local treasures.</div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4 founder-picture-col"><img src={jsRoutes.controllers.Assets.versioned("images/heaney.jpg").url} className="founder-picture" /></div>
      <div className="col-md-8 founder-col">
        <div className="founder-name">Samuel Heaney</div>
        <div className="founder-subheader">Software Engineer</div>
        <div className="founder-copy">Samuel is an American Mexican Software Engineer interested in bridging technology and people. He seeks out projects which push thinking outside the box. When not coding or playing around with new tech, he’s an avid football fanatic and enjoys a good pint of dark beer.</div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4 founder-picture-col"><img src={jsRoutes.controllers.Assets.versioned("images/cheky.jpg").url} className="founder-picture" /></div>
      <div className="col-md-8 founder-col">
        <div className="founder-name">Serguei Orozco</div>
        <div className="founder-subheader">Interaction Designer</div>
        <div className="founder-copy">Serguei is an Interaction Designer from Mexico. He has been working with User Experience for a long time. He knows that understanding the user is what makes an application differentiate. You can usually find him traveling the world and looking for the most authentic and local experience in every place he visits.</div>
      </div>
    </div>
  </div>
);

ReactDOM.render(<AboutUs />, document.getElementById("content"));
