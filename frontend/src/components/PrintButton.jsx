

// import React from "react";

// const PrintButton = ({ image, tagline }) => {
//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return alert("Popup blocked! Please allow popups.");

//     const htmlContent = `
//       <html>
//         <head>
//           <title>Print</title>
//           <style>
//             body {
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               height: 100vh;
//               margin: 0;
//               background-image: url('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D');
//               background-size: cover;
//               font-family: Arial, sans-serif;
//             }
//             .polaroid {
//               background: white;
//               padding: 10px;
//               border: 1px solid #ccc;
//               box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
//               width: 300px;
//               text-align: center;
//               border-radius: 10px;
//             }
//             .polaroid img {
//               width: 100%;
//               border-radius: 10px;
//             }
//             .tagline {
//               margin-top: 10px;
//               font-size: 14px;
//               color: #333;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="polaroid">
//             <img src="${image}" />
//             <div class="tagline">${tagline}</div>
//           </div>
//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function () {
//                 window.close();
//               };
//             };
//           </script>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
//   };

//   return (
//     <button
//       onClick={handlePrint}
//       className="btn btn-primary"
//       style={{
//         backgroundColor: "#007bff",
//         borderColor: "#007bff",
//         color: "white",
//         padding: "10px 20px",
//         borderRadius: "5px",
//         cursor: "pointer",
//       }}
//     >
//       Print
//     </button>
//   );
// };


// export default PrintButton;


import React from "react";

const PrintButton = ({ images, tagline, isCollage, image }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Popup blocked! Please allow popups.");

    // Create the print layout depending on whether it's a collage or single image
    const printContent = isCollage
      ? `
          <div style="display: flex; flex-wrap: wrap; justify-content: space-around; padding: 20px;">
            ${images.map(
              (img, i) => `
                <div style="width: 30%; padding: 5px;">
                  <img src="${img}" style="width: 100%; border-radius: 8px;" />
                  <div style="text-align: center; font-size: 14px; margin-top: 5px; color: #333;">
                    ${tagline || "No tagline"}
                  </div>
                </div>`
            ).join('')}
          </div>`
      : `
          <div style="text-align: center; padding: 10px;">
            <img src="${image}" style="width: 100%; border-radius: 10px;" />
            <div style="font-size: 14px; margin-top: 10px; color: #333;">${tagline}</div>
          </div>`;

    const htmlContent = `
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .itinerary-output {
              margin-top: 10px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
              font-size: 14px;
              line-height: 1.6;
            }

            .itinerary-output h3 {
              font-size: 1.2em;
              margin-bottom: 0.5em;
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 0.3em;
            }

            .itinerary-output ul {
              padding-left: 0;
              list-style-type: none;
            }

            .itinerary-output li {
              margin-bottom: 0.5em;
            }
          </style>
        </head>
        <body>
          <div class="itinerary-output">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="btn btn-primary"
      style={{
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Print
    </button>
  );
};

export default PrintButton;
