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
      'url("https://th.bing.com/th/id/OIP.-avYl7Wyj4qN_qOG4ph8SQHaEu?rs=1&pid=ImgDetMain")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  }}
  className="hero-section py-5 bg-light text-center"
>
  {/* Overlay with blurred background */}
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darken the background for contrast
      filter: 'blur(8px)', // Apply blur to the background only
      zIndex: 1, // Put the blur behind the content
    }}
  ></div>

  {/* Text and Button Container (Content will stay clear) */}
  <div
    style={{
      position: 'relative', // Keep text above the blurred background
      zIndex: 2, // Ensure the content stays above the blurred overlay
      color: 'white', // Make text white for contrast
      fontWeight: 'bold', // Make text bold
      fontSize: '2rem', // Increase font size for better visibility
      textAlign: 'center',
      paddingTop: '20px', // Adjust space from the top for centering
    }}
  >
    <h1 className="display-4 fw-bold">"Your Journey, Your Wall"</h1>
    <p className="lead ">Make your memories last forever with our collage editor</p>

    <div className="flex justify-end p-1">
      <button className="ps-3 pe-2 pt-0 pb-0" onClick={() => navigate('/my-travel-wall')}>
        Click Here
      </button>
    </div>
  </div>
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