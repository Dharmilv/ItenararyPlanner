import React, { useState } from "react";
import PrintButton from "./PrintButton";

const MAX_IMAGES = 8;

const MyTravelWall = () => {
  const [images, setImages] = useState([]);
  const [taglines, setTaglines] = useState([]);
  const [collageTagline, setCollageTagline] = useState("");
  const [links, setLinks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Recommendations for specific categories
  const recommendedPlaces = {
    beach: [
      "Maldives",
      "Hawaii",
      "Bora Bora",
      "Phuket",
      "Maui, Hawaii",
      "Seychelles",
      "Caribbean Islands",
      "Bondi Beach, Australia",
    ],
    mountain: [
      "Swiss Alps",
      "Himalayas",
      "Rocky Mountains",
      "Andes",
      "Mount Fuji, Japan",
      "Mount Kilimanjaro, Tanzania",
      "Patagonia, Argentina",
      "Banff National Park, Canada",
    ],
    forest: [
      "Amazon Rainforest, Brazil",
      "Black Forest, Germany",
      "Olympic National Park, USA",
      "Borneo Rainforest, Malaysia",
      "Redwood National Park, USA",
      "Aokigahara Forest, Japan",
      "Daintree Rainforest, Australia",
    ],
    desert: [
      "Sahara Desert, Africa",
      "Mojave Desert, USA",
      "Atacama Desert, Chile",
      "Wadi Rum, Jordan",
      "Namib Desert, Namibia",
      "Karakum Desert, Turkmenistan",
      "Sonoran Desert, USA/Mexico",
    ],
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > MAX_IMAGES) {
      return alert("You can only upload up to 8 images.");
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
    setTaglines((prev) => [...prev, ...files.map(() => "")]);

    // Trigger recommendations based on uploaded images
    generateRecommendations();
  };

  const handleTaglineChange = (index, value) => {
    const updatedTaglines = [...taglines];
    updatedTaglines[index] = value;
    setTaglines(updatedTaglines);
  };

  const generateLink = (id) => {
    const simulatedLink = `${window.location.origin}/view/${id}`;
    setLinks((prev) => [...prev, { id, link: simulatedLink }]);
  };

  const getLinkById = (id) => links.find((l) => l.id === id)?.link;

  // This function generates recommendations based on the uploaded images
  const generateRecommendations = () => {
    // If images are uploaded, recommend places from all categories
    if (images.length > 0) {
      const allCategories = ["beach", "mountain", "forest", "desert"];
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      setRecommendations(recommendedPlaces[randomCategory]);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="container bg-white bg-opacity-75 p-5 rounded shadow">
        <h1 className="text-center mb-4 display-5 fw-bold">My Travel Wall</h1>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="form-control"
          />
        </div>

        {images.length <= 5 ? (
          images.map((img, i) => {
            const id = `single-${i}`;
            return (
              <div key={id} className="card mb-4 p-3 shadow-sm">
                <img
                  src={img}
                  alt={`Travel ${i}`}
                  className="card-img-top rounded"
                  style={{ objectFit: "cover", height: "300px" }}
                />
                <div className="card-body">
                  <input
                    type="text"
                    placeholder="Enter a tagline"
                    value={taglines[i]}
                    onChange={(e) => handleTaglineChange(i, e.target.value)}
                    className="form-control mb-3"
                  />
                  <div className="d-flex gap-3">
                    <PrintButton image={img} tagline={taglines[i]} />
                    <button
                      className="btn btn-success"
                      onClick={() => generateLink(id)}
                    >
                      Generate Link
                    </button>
                  </div>
                  {getLinkById(id) && (
                    <div className="mt-2 text-primary">
                      Shareable link:{" "}
                      <a
                        href={getLinkById(id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {getLinkById(id)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card p-4 shadow-lg">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {images.map((img, i) => (
                <div key={i} className="col text-center">
                  <img
                    src={img}
                    alt={`Travel ${i}`}
                    className="img-fluid rounded"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <p className="mt-2 small text-muted">{taglines[i]}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter a tagline for collage"
                value={collageTagline}
                onChange={(e) => setCollageTagline(e.target.value)}
                className="form-control"
              />
              <div className="text-center fw-semibold mt-3">
                {collageTagline}
              </div>
              <div className="d-flex gap-3 mt-3">
                <PrintButton
                  images={images}
                  tagline={collageTagline}
                  isCollage={true}
                />
                <button
                  className="btn btn-success"
                  onClick={() => generateLink("collage")}
                >
                  Generate Link
                </button>
              </div>
              {getLinkById("collage") && (
                <p className="mt-2 text-primary">
                  Shareable link:{" "}
                  <a
                    href={getLinkById("collage")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-underline"
                  >
                    {getLinkById("collage")}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Display Recommended Places */}
        {recommendations.length > 0 && (
          <div className="mt-4">
            <h3>Recommended Places for Next Time:</h3>
            <ul>
              {recommendations.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTravelWall;
