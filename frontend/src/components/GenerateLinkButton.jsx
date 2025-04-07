const GenerateLinkButton = ({ images, taglines }) => {
    const handleGenerate = () => {
      alert("Link generated! (Simulated)");
      // Simulate generation – real implementation needs backend
      // or store data temporarily in cloud/localstorage
    };
  
    return (
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-green-600 text-white rounded-xl shadow"
      >
        Generate Link
      </button>
    );
  };
  
  export default GenerateLinkButton;
  