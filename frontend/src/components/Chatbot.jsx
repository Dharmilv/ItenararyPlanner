import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"; // Import forwardRef and useImperativeHandle
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "./Chatbot.css";

// Function to format the itinerary professionally
const formatItinerary = (itineraryText) => {
  try {
    // Check if itineraryText is an object
    if (typeof itineraryText === 'object' && itineraryText !== null) {
      // Convert the object to a string
      itineraryText = JSON.stringify(itineraryText, null, 2);
    }

    // Remove asterisks and trim whitespace
    const cleanedText = itineraryText.replace(/\*/g, '').trim();
    const lines = cleanedText.split('\n');
    let formattedHTML = '';
    let isList = false;

    lines.forEach(line => {
      line = line.trim();
      if (!line) return; // Skip empty lines

      if (/^Day\s*\d+:/i.test(line)) {
        // Day heading
        if (isList) {
          formattedHTML += '</ul>'; // Close previous list if any
          isList = false;
        }
        formattedHTML += `<h5 style="margin-top: 1rem; margin-bottom: 0.5rem;"><strong>${line}</strong></h5>`;
      } else if (line.startsWith('-') || /^\d+\./.test(line)) {
        // List item (starts with '-' or '1.')
        if (!isList) {
          formattedHTML += '<ul style="list-style-position: inside; padding-left: 0; margin-bottom: 1rem;">';
          isList = true;
        }
        formattedHTML += `<li style="margin-bottom: 0.25rem;">${line.replace(/^- |^\d+\.\s*/, '')}</li>`; // Remove list marker
      } else {
        // Regular paragraph or note
        if (isList) {
          formattedHTML += '</ul>'; // Close previous list if any
          isList = false;
        }
         // Check if it looks like a note section header
        if (/^(Notes|Important Information|Tips):/i.test(line)) {
             formattedHTML += `<h6 style="margin-top: 1rem; margin-bottom: 0.5rem;"><strong>${line}</strong></h6>`;
        } else {
            formattedHTML += `<p style="margin-bottom: 0.5rem;">${line}</p>`;
        }
      }
    });

    if (isList) {
      formattedHTML += '</ul>'; // Close any remaining list
    }

    return formattedHTML; // Return the raw HTML string
  } catch (error) {
    console.error("Error formatting itinerary:", error);
    return '<p>Sorry, I couldn\'t format the itinerary properly.</p>'; // Return simple error message
  }
};

const Chatbot = forwardRef((props, ref) => { // Wrap component with forwardRef
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(""); // Keep local input state for manual chat
  const [isOpen, setIsOpen] = useState(false); // Toggle state
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });
      let botText = res.data.reply;
      if (typeof botText === 'object' && botText !== null) {
        botText = JSON.stringify(botText, null, 2);
      }
      setMessages([...newMessages, { sender: "Bot", text: botText }]);
    } catch (err) {
      console.error("Error fetching itinerary:", err);
      setMessages([...newMessages, { sender: "Bot", text: "Oops! Something went wrong." }]);
    }
  };

  // Function to generate and download the PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Title for the PDF
    doc.text("Travel Itinerary", 20, 20);

    // Define margins and line height
    const marginLeft = 20;
    const marginTop = 30;
    const maxWidth = 180;
    const lineHeight = 10;

    // Initial Y position
    let yOffset = marginTop;

    // Function to add text with auto wrapping
    const addText = (text) => {
      // Basic HTML stripping for PDF
      const plainText = text.replace(/<[^>]*>/g, '');
      const textWidth = doc.getStringUnitWidth(plainText) * doc.getFontSize() / doc.internal.scaleFactor;
      let xPos = marginLeft;

      // Check if text fits in the page width, and wrap it if textWidth > maxWidth
      if (textWidth > maxWidth) {
        const words = plainText.split(' ');
        let line = '';
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const testWidth = doc.getStringUnitWidth(testLine) * doc.getFontSize() / doc.internal.scaleFactor;
          if (testWidth > maxWidth) {
            doc.text(line, xPos, yOffset);
            line = words[i] + ' ';
            yOffset += lineHeight;
          } else {
            line = testLine;
          }
        }
        doc.text(line, xPos, yOffset);
      } else {
        doc.text(plainText, xPos, yOffset);
      }
      yOffset += lineHeight;
    };

    // Add each message from the conversation to the PDF
    messages.forEach((msg) => {
      addText(`${msg.sender}: ${msg.text}`);
      if (yOffset > 270) { // Check if the text is overflowing and create a new page if necessary
        doc.addPage();
        yOffset = marginTop;
      }
    });

    // Save the PDF
    doc.save("itinerary.pdf");
  };

  // Expose generateItinerary function to parent component using ref
  useImperativeHandle(ref, () => ({
    generateItinerary: async (prompt) => {
      setIsOpen(true); // Ensure the chatbot is open

      const newMessages = [...messages, { sender: "You", text: prompt }];
      setMessages(newMessages); // Display the prompt immediately

      try {
        const res = await axios.post("http://localhost:5000/api/chat", {
          message: prompt, // Send the generated prompt to the backend
        });
        let botText = res.data.reply;
        if (typeof botText === 'object' && botText !== null) {
          botText = JSON.stringify(botText, null, 2);
        }
        setMessages([...newMessages, { sender: "Bot", text: botText }]); // Add bot's response
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setMessages([...newMessages, { sender: "Bot", text: "Sorry, I couldn't generate the itinerary." }]);
      }
    }
  }));

  return (
    <>
      {/* Toggle Button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "30px",
          padding: "12px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close Chat" : "Itinerary Creation"}
      </button>

      {/* Chatbot Overlay (Blur the background) */}
      {isOpen && <div className="chatbot-overlay" />}

      {/* Chatbot Container (shown only when isOpen is true) */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Close Button */}
          <button
            className="close-chatbot-button"
            onClick={() => setIsOpen(false)} // Close the chatbot when clicked
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "11px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            X
          </button>

          <h3>Travel Assistant</h3>
          <div className="chatbox">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender === "You" ? "user" : "bot"}`}>
                {msg.sender === "Bot" ? (
                  // Render bot messages using a formatting function
                  <div className="card card-body text-start" dangerouslySetInnerHTML={{ __html: formatItinerary(msg.text) }}></div>
                ) : (
                  // Render user messages as plain text
                  <div>{msg.text}</div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Ask me anything about travel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>

          {/* Button to download the conversation as a PDF */}
          <button onClick={downloadPDF} className="download-pdf-button">
            Download Itinerary as PDF
          </button>
        </div>
      )}
      
    </>
  );
}); // Close the forwardRef wrapper

export default Chatbot;
