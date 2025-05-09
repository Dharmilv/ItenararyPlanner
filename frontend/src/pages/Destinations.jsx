import React from 'react';
import IndiaDestinations from '../components/IndiaDestinations';
import EuropeDestinations from '../components/EuropeDestinations';
import { useNavigate } from 'react-router-dom';


function Destinations() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div
        style={{
          height: '40vh',
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://th.bing.com/th/id/OIP.-avYl7Wyj4qN_qOG4ph8SQHaEu?rs=1&pid=ImgDetMain")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '0 1rem',
        }}
        className="hero-section"
      >
        <h1 className="display-4 fw-bold mb-3">Your Journey, Your Wall</h1>
        <p className="lead mb-4">Make your memories last forever with our collage editor</p>
        <button
          className="btn btn-light btn-lg shadow"
          onClick={() => navigate('/my-travel-wall')}
        >
          Click Here
        </button>
      </div>

      {/* India Destinations */}
      <div className="container py-5">
        <h2 className="display-6 fw-bold mb-4">Plan as per the best destinations in India</h2>
        <IndiaDestinations />
      </div>
      
      {/* Europe Destinations */}
      <div className="container py-5">
        <h2 className="display-6 fw-bold mb-4">Top countries to visit in Europe</h2>
        <EuropeDestinations />
      </div>
      
    </div>
  );
}

export default Destinations;