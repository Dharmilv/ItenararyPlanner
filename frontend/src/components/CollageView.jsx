// src/components/CollageView.jsx
const CollageView = ({ images, tagline }) => {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">{tagline}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Travel ${i}`}
              className="w-full h-40 object-cover rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default CollageView;
  