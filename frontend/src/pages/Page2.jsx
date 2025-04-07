import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Page2() {
  return (
    <div className='mt-5'>
      {/* Main Container */}
      <div className="container py-5">
        {/* Heading */}
        <h2 className="text-center mb-4">How it works?</h2>

        {/* Steps Row */}
        <div className="row text-center">
          {/* Step 1 */}
          <div className="col-md-3 mb-4">
            {/* Placeholder icon or image */}
            <img
              src="data:image/png;base64,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"
              style={{
                width: '200px',
                height: '150px',
                objectFit: 'contain' // or 'contain'
              }}
              alt="Step 1"
              className="mb-3"
            />
            <h5>Handpick Your Selection</h5>
            <p className="text-muted">
              From solo travel to workation, honeymoon to family travel, 
              tell us about your mood, budget, and more.
            </p>
          </div>

          {/* Step 2 */}
          <div className="col-md-3 mb-4">
            <img
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRSriE3txKD--WnN0cynpzdXXxRQIgoPgqfmczsR0zKXKcMMDaB"
              style={{
                width: '200px',
                height: '150px',
                objectFit: 'contain' // or 'contain'
              }}
              alt="Step 2"
              className="mb-3"
            />
            <h5>Unleash AI’s Itinerary Wizardry!</h5>
            <p className="text-muted">
              Get a unique itinerary completely personalized for you, 
              all in one place.
            </p>
          </div>

          {/* Step 3 */}
          <div className="col-md-3 mb-4">
            <img
              src="https://d31aoa0ehgvjdi.cloudfront.net//eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS93aHl1cy0zLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjUwMCwiaGVpZ2h0Ijo1MDAsImZpdCI6ImNvdmVyIn19fQ=="
              style={{
                width: '200px',
                height: '150px',
                objectFit: 'contain' // or 'contain'
              }}
              alt="Step 3"
              className="mb-3"
            />
            <h5>Easy Bookings with 24x7 Concierge</h5>
            <p className="text-muted">
              From activities to hotels, book it all in one click, 
              and enjoy 24/7 assistance while you explore.
            </p>
          </div>

          {/* Step 4 */}
          <div className="col-md-3 mb-4">
            <img
              src="https://img.freepik.com/premium-vector/online-payments-shopping-concept-man-hands-holding-phones-using-apps-internet-communication-activity-global-network-marketplace-messenger-vector-design_570429-17177.jpg"
              style={{
                width: '200px',
                height: '150px',
                objectFit: 'contain' // or 'contain'
              }}
              alt="Step 4"
              className="mb-3"
            />
            <h5>No Commissions — Pay for What You Get</h5>
            <p className="text-muted">
              No hidden charges or bundling. Pay for what you get.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page2;
