// components/EuropeDestinations.js
import React from 'react';
import { Link } from 'react-router-dom';

function EuropeDestinations() {
  const destinations = [
    {
      id: 1,
      name: 'Greece',
      image: 'https://static.visa2fly.com/blog/blog-production/greece-famous-things/greece-famous-things.jpeg',
      bestTime: 'Apr-Oct'
    },
    {
      id: 2,
      name: 'United Kingdom',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVJZ55ga6DEKP3FM2tWbL0ciu1fW4oU8ckXw&s',
      bestTime: 'May-Sep'
    },
    {
      id: 3,
      name: 'France',
      image: 'https://hips.hearstapps.com/hmg-prod/images/aerial-view-of-paris-streets-and-eiffel-tower-at-royalty-free-image-1645194552.jpg?crop=0.99953xw:1xh;center,top&resize=980:*',
      bestTime: 'Apr-Oct'
    },
    {
      id: 4,
      name: 'Italy',
      image: 'https://assets.vogue.com/photos/65f04d926294babad5413eb1/16:9/w_5760,h_3240,c_limit/GettyImages-1380534040.jpg',
      bestTime: 'Jun-Sep'
    },
    {
      id: 5,
      name: 'Germany',
      image: 'https://pyt-blogs.gumlet.io/2022/05/maheshkumar-painam-HF-lFqdOMF8-unsplash.jpg?auto=format&ixlib=php-3.3.0',
      bestTime: 'May-Sep'
    }
  ];

  return (
    <div className="row g-4">
      {destinations.map(destination => (
        <div key={destination.id} className="col-lg col-md-4 col-sm-6">
          <Link to={`/europe/${destination.id}`} className="text-decoration-none">
            <div className="card destination-card h-100 border-0 shadow-sm position-relative overflow-hidden">
              <img 
                src={destination.image} 
                className="card-img" 
                alt={destination.name} 
                style={{height: '240px', objectFit: 'cover'}} 
              />
              <div className="position-absolute top-0 start-0 p-3">
                <span className="badge bg-dark text-white px-3 py-2">
                  Best time : {destination.bestTime}
                </span>
              </div>
              <div className="card-img-overlay d-flex flex-column justify-content-end text-white" 
                style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
                <h4 className="card-title fw-bold">{destination.name}</h4>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <div className="col-12 text-end">
        <button className="btn btn-outline-primary">
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default EuropeDestinations;