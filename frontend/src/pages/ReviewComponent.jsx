import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [expandedReview, setExpandedReview] = useState(null);
  
  const reviews = [
    {
      id: 1,
      name: "Anjali Patel",
      title: "Travel Enthusiast",
      image: "https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9leHBsb3JlcnMvbmlzYWdyYS5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7ImZpdCI6ImNvdmVyIn19fQ==",
      rating: 5,
      review: "I can't thank you enough for helping me plan my trip. You guys are amazing. Janhavi & Devyani and the entire team kept checking on me. The entire team was so responsive & planned everything really well. Kudos to you guys. Lots of Love.",
      date: "March 15, 2023",
      location: "Goa, India"
    },
    {
      id: 2,
      name: "Rahul Sharma",
      title: "Adventure Seeker",
      image: "https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9leHBsb3JlcnMvcHJhc2VuamVldC5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7ImZpdCI6ImNvdmVyIn19fQ==",
      rating: 5,
      review: "It was an experience to remember and very moderate experience cost. Love the way they handled things. Perfect hotels, rich experience and memories to collect. Thanks you.. will definitely look forward to the next trip.",
      date: "April 2, 2023",
      location: "Himalayas, India"
    },
    {
      id: 3,
      name: "Tina Desai",
      title: "Family Traveler",
      image: "https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9JTUctMjAyMjEyMzEtV0EwMDI3LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJjb3ZlciJ9fX0=",
      rating: 5,
      review: "Thank you for the trip plan. We had a lot of fun. Please convey our gratitude for the cab driver. He was very humble, polite and helpful. The itinerary was perfectly planned with just the right mix of activities and relaxation time for our family.",
      date: "May 10, 2023",
      location: "Kerala, India"
    },
    {
      id: 4,
      name: "Priya Khanna",
      title: "Luxury Traveler",
      image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",
      rating: 5,
      review: "The trip exceeded all our expectations! The itinerary was perfectly balanced with adventure and relaxation. Every hotel was excellent and the local guides were knowledgeable and friendly. The attention to detail in our luxury accommodations was particularly impressive.",
      date: "June 22, 2023",
      location: "Maldives"
    },
    {
      id: 5,
      name: "Amit Joshi",
      title: "Solo Explorer",
      image: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
      rating: 4,
      review: "Our family trip was wonderfully organized. The destinations were beautiful and the accommodations were comfortable. Special thanks to the team for handling our last-minute requests! The only reason I'm not giving 5 stars is that one of the activities was slightly different than described.",
      date: "July 5, 2023",
      location: "Rajasthan, India"
    },
    {
      id: 6,
      name: "Meera Gupta",
      title: "Repeat Customer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s",
      rating: 5,
      review: "This was my second trip with you guys and it was even better than the first! The attention to detail in planning every aspect of the journey made it stress-free and enjoyable. From the airport transfers to the restaurant recommendations, everything was flawless. I've already recommended you to all my friends!",
      date: "August 18, 2023",
      location: "Bali, Indonesia"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, currentSlide]);

  const handlePrevious = () => {
    setCurrentSlide(prev => (prev === 0 ? reviews.length - 1 : prev - 1));
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const toggleExpand = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '1200px' }}>
      <section className="testimonials-section">
        <div className="text-center mb-5">
          <h6 className="text-uppercase text-warning mb-3">Testimonials</h6>
          <h2 className="fw-bold mb-3">What Our Travelers Say</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Hear from our happy customers about their unforgettable travel experiences with us.
          </p>
        </div>
        
        <div className="position-relative">
          <div className="row g-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="col-12"
              >
                <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                  <div className="row g-0">
                    <div className="col-md-4 bg-light d-flex align-items-center justify-content-center p-4">
                      <img 
                        src={reviews[currentSlide].image} 
                        alt={reviews[currentSlide].name}
                        className="rounded-circle img-fluid shadow"
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body p-4 p-lg-5">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h4 className="card-title mb-1">{reviews[currentSlide].name}</h4>
                            <p className="text-muted small mb-2">{reviews[currentSlide].title}</p>
                            <div className="d-flex align-items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={i < reviews[currentSlide].rating ? 'text-warning' : 'text-muted'} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">{reviews[currentSlide].date}</small>
                            <small className="text-muted">{reviews[currentSlide].location}</small>
                          </div>
                        </div>
                        
                        <p className="card-text mb-4">
                          {expandedReview === reviews[currentSlide].id 
                            ? reviews[currentSlide].review 
                            : `${reviews[currentSlide].review.substring(0, 250)}...`
                          }
                          <button 
                            onClick={() => toggleExpand(reviews[currentSlide].id)}
                            className="btn btn-link p-0 ms-2 text-decoration-none"
                          >
                            {expandedReview === reviews[currentSlide].id ? 'Show less' : 'Read more'}
                          </button>
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex">
                            {reviews.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`btn btn-sm mx-1 p-0 ${currentSlide === index ? 'text-warning' : 'text-muted'}`}
                                style={{ width: '10px', height: '10px', borderRadius: '50%' }}
                                aria-label={`Go to slide ${index + 1}`}
                              >
                                •
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <button 
            className="btn btn-warning rounded-circle position-absolute top-50 start-0 translate-middle-y shadow-sm d-none d-md-flex d-flex align-items-center justify-content-center"
            style={{ width: '50px', height: '50px', left: '-25px', zIndex: 10 }}
            onClick={handlePrevious}
            aria-label="Previous review"
          >
            <FaChevronLeft />
          </button>

          <button 
            className="btn btn-warning rounded-circle position-absolute top-50 end-0 translate-middle-y shadow-sm d-none d-md-flex d-flex align-items-center justify-content-center"
            style={{ width: '50px', height: '50px', right: '-25px', zIndex: 10 }}
            onClick={handleNext}
            aria-label="Next review"
          >
            <FaChevronRight />
          </button>
        </div>
        
        {/* Mobile controls */}
        <div className="d-flex justify-content-center mt-4 d-md-none">
          <button 
            className="btn btn-warning rounded-circle mx-2 shadow-sm"
            style={{ width: '40px', height: '40px' }}
            onClick={handlePrevious}
            aria-label="Previous review"
          >
            <FaChevronLeft />
          </button>
          <button 
            className="btn btn-warning rounded-circle mx-2 shadow-sm"
            style={{ width: '40px', height: '40px' }}
            onClick={handleNext}
            aria-label="Next review"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReviewComponent;