import React from 'react';
import './HomeComponent.css';

import { Link } from 'react-router-dom';

const HomeComponent = _ => {
  return (
    <section className="home">
      <h3>Welcome To the Equinox's Financial Experimental CRM</h3>
      <div className="home__list">
        <div className="home__list__item">
          <Link to="/test">Test Plot</Link>
          <p>
            Here you could test new Libs, ideas, whatever you want, it's like
            sandbox for not finished ideas
          </p>
        </div>
        <div className="home__list__item">
          <Link to="/basic">Tiingo</Link>
          <p>
            Here you could work with Tiingo API, please make sure that all of
            your new functional is separated on periods, and described with
            comments/documentation/etc
          </p>
        </div>
        <div className="home__list__item">
          <Link to="/iex">IEX</Link>
          <p>
            Here you could work with IEX API, please make sure that all of your
            new functional is separated on periods, and described with
            comments/documentation/etc
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
