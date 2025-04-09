import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./Chatbot.css";

const formatItinerary = (itineraryText) => {
  try {
    // Check if itineraryText is an object
    if (typeof itineraryText === 'object' && itineraryText !== null) {
      // Convert the object to a string
      itineraryText = JSON.stringify(itineraryText, null, 2);
    }

    const days = itineraryText.split(/(Day\s*\d+:)/i);
    let itineraryPlan = '';
    let notes = '';

    days.forEach((part, index) => {
      if (index % 2 === 1) {
        // Itinerary part
        itineraryPlan += part;
      } else {
        // Notes part
        notes += part;
      }
    });

    let formattedHTML = '';
    if (itineraryPlan) {
      const itineraryItems = itineraryPlan.split('\n').filter(line => line.trim() !== '');
      formattedHTML += '<h4 style="margin-bottom: 0.5rem;">Itinerary Plan:</h4>';
      formattedHTML += '<ul style="list-style-position: inside; padding-left: 0; margin-bottom: 1rem;">';
      itineraryItems.forEach(item => {
        const cleanItem = item.replace(/\*/g, '').trim();
        formattedHTML += `<li style="margin-bottom: 0.25rem;">${cleanItem}</li>`;
      });
      formattedHTML += '</ul><hr style="border-top: 1px solid #ccc; margin-bottom: 1rem;" />';
    }

    if (notes) {
      notes = notes.replace(/\*/g, '').trim();
      formattedHTML += '<h4>Notes:</h4><p style="white-space: pre-line;">' + notes + '</p>';
    }

    return formattedHTML;
  } catch (error) {
    console.error("Error formatting itinerary:", error);
    return '<p>Sorry, I couldn\'t format the itinerary properly.</p>';
  }
};

const Chatbot = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
      const res = await axios.post("https://itenararyplanner.onrender.com/api/chat", {
        message: input,
      });
      let botText = res.data.reply;
      if (typeof botText === 'object' && botText !== null) {
        botText = JSON.stringify(botText, null, 2);
      }
      setMessages([...newMessages, { sender: "Bot", text: botText }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: "Bot", text: "Oops! Something went wrong." }]);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    doc.text("Travel Itinerary", 20, 20);

    const marginLeft = 20;
    const marginTop = 30;
    const maxWidth = 180;
    const lineHeight = 10;

    let yOffset = marginTop;

    const addText = (text) => {
      const plainText = text.replace(/<[^>]*>/g, '');
      const textWidth = doc.getStringUnitWidth(plainText) * doc.getFontSize() / doc.internal.scaleFactor;
      let xPos = marginLeft;

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

    messages.forEach((msg) => {
      addText(`${msg.sender}: ${msg.text}`);
      if (yOffset > 270) {
        doc.addPage();
        yOffset = marginTop;
      }
    });

    doc.save("itinerary.pdf");
  };

  useImperativeHandle(ref, () => ({
    generateItinerary: async (prompt) => {
      setIsOpen(true);

      const newMessages = [...messages, { sender: "You", text: prompt }];
      setMessages(newMessages);

      try {
        const res = await axios.post("https://itenararyplanner.onrender.com/api/chat", {
          message: prompt,
        });
        let botText = res.data.reply;
        if (typeof botText === 'object' && botText !== null) {
          botText = JSON.stringify(botText, null, 2);
        }
        setMessages([...newMessages, { sender: "Bot", text: botText }]);
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
