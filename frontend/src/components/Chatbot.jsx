import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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
      const botText = res.data.reply;
      setMessages([...newMessages, { sender: "Bot", text: botText }]);
    } catch (err) {
      console.error(err);
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
      const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
      let xPos = marginLeft;

      // Check if text fits in the page width, and wrap it if necessary
      if (textWidth > maxWidth) {
        const words = text.split(' ');
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
        doc.text(text, xPos, yOffset);
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
                <div className="message-text">{msg.text}</div>
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
};

export default Chatbot;
