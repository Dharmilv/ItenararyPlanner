import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReviewComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const reviews = [
    {
      id: 1,
      name: "Anjali",
      image: "https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9leHBsb3JlcnMvbmlzYWdyYS5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7ImZpdCI6ImNvdmVyIn19fQ==",
      rating: 5,
      review: "I can't thank you enough for helping me plan my trip. You guys are amazing. Janhavi & Devyani and the entire team kept checking on me. The entire team was so responsive & planned everything really well. Kudos to you guys. Lots of Love.",
      more: true
    },
    {
      id: 2,
      name: "Rahul",
      image: "https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9leHBsb3JlcnMvcHJhc2VuamVldC5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7ImZpdCI6ImNvdmVyIn19fQ==",
      rating: 5,
      review: "It was an experience to remember and very moderate experience cost..Love the way they handled things. Perfect hotels, rich experience and memories to collect. Thanks you.. will definitely look forward to the next trip.."
    },
    {
      id: 3,
      name: "Tina",
      image: "https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9JTUctMjAyMjEyMzEtV0EwMDI3LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJjb3ZlciJ9fX0=",
      rating: 5,
      review: "Thank you for the trip plan. We had a lot of fun. Please convey our gratitude for the cab driver. He was very humble, polite and helpful."
    },
    {
      id: 4,
      name: "Priya",
      image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",
      rating: 5,
      review: "The trip exceeded all our expectations! The itinerary was perfectly balanced with adventure and relaxation. Every hotel was excellent and the local guides were knowledgeable and friendly."
    },
    {
      id: 5,
      name: "Amit",
      image: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
      rating: 4,
      review: "Our family trip was wonderfully organized. The destinations were beautiful and the accommodations were comfortable. Special thanks to the team for handling our last-minute requests!"
    },
    {
      id: 6,
      name: "Meera",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s",
      rating: 5,
      review: "This was my second trip with you guys and it was even better than the first! The attention to detail in planning every aspect of the journey made it stress-free and enjoyable.",
      more: true
    }
  ];
  
  // Fix navigation logic to handle any number of reviews
const handlePrevious = () => {
  setCurrentSlide(prev => (prev === 0 ? Math.max(0, reviews.length - 3) : Math.max(0, prev - 1)));
};

const handleNext = () => {
  setCurrentSlide(prev => (prev + 3 >= reviews.length ? prev : prev + 1));
};
  
  // Display 3 reviews at a time
  const visibleReviews = reviews.slice(currentSlide, currentSlide + 3);
  while (visibleReviews.length < 3) {
    visibleReviews.push(null);
  }
  
  return (
    <div className="container py-5">
      

      <section className="testimonials-section">
        <h1 className="text-center mb-5 fw-bold">Happy Community</h1>
        
        <div className="row position-relative">
          {visibleReviews.map((review, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              {review && (
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="rounded-circle"
                        width="60" 
                        height="60"
                        style={{objectFit: "cover"}}
                      />
                      <div className="ms-3">
                        <h5 className="mb-1">{review.name}</h5>
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <small key={i}>★</small>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-secondary">
                      {review.review}
                      {review.more && (
                        <span className="text-muted">...more</span>
                      )}
                    </p>
                    
                    <div className="mt-3">
                      <a href="#" className="btn btn-warning">View Itinerary</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Make visible on mobile too */}
          <button 
            className="btn btn-warning rounded-circle position-absolute start-0 top-50 translate-middle-y shadow-sm"
            style={{marginLeft: "-20px", width: "40px", height: "40px", zIndex: 10}}
            onClick={handlePrevious}
          >
          <span>&lt;</span>
          </button>

          <button 
            className="btn btn-warning rounded-circle position-absolute end-0 top-50 translate-middle-y shadow-sm"
            style={{marginRight: "-20px", width: "40px", height: "40px", zIndex: 10}}
            onClick={handleNext}
          >
          <span>&gt;</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReviewComponent;