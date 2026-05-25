import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <h1>Pokemon finder</h1>
      <p>Author: Nik</p>
      <p>
        At first it was a site with a list of cars, but the API was bad and also cost money. That's why now there are things better than cars, Pokemon!
      </p>
      <p>
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noopener noreferrer">
          RS School React Course
        </a>
      </p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
};