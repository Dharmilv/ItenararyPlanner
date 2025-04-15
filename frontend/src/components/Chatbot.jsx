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

    let newMessages = [...messages];
    const lastUserMessageIndex = newMessages.findLastIndex(msg => msg.sender === "You");

    if (lastUserMessageIndex !== -1) {
      // Update the last user message
      newMessages[lastUserMessageIndex] = { sender: "You", text: input };
    } else {
      // Add a new user message
      newMessages = [...messages, { sender: "You", text: input }];
    }

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

    let yOffset = 30;
    const lineHeight = 10;
    const marginLeft = 20;
    const maxWidth = 180;

    messages.forEach((msg) => {
      if (msg.sender === "Bot") {
        // Format the bot's message using formatItinerary
        const formattedHTML = formatItinerary(msg.text);

        // Function to add HTML content to the PDF
        const addHtmlToPdf = (html, yOffset) => {
          const lines = html.split("<br>"); // Split HTML into lines
          let currentY = yOffset;

          lines.forEach((line) => {
            // Remove HTML tags from the line
            const cleanLine = line.replace(/<[^>]*>/g, "");

            // Split the line into words
            const words = cleanLine.split(" ");
            let currentLine = "";

            words.forEach((word) => {
              const testLine = currentLine + word + " ";
              const textWidth = doc.getTextWidth(testLine);

              if (textWidth > maxWidth && currentLine.length > 0) {
                doc.text(currentLine, marginLeft, currentY);
                currentY += lineHeight;
                currentLine = word + " ";
              } else {
                currentLine = testLine;
              }
            });

            // Add the remaining text to the document
            doc.text(currentLine, marginLeft, currentY);
            currentY += lineHeight;
          });

          return currentY;
        };

        yOffset = addHtmlToPdf(formattedHTML, yOffset);
      } else {
        // For user messages, just add the text
        const text = `${msg.sender}: ${msg.text}`;
        doc.text(text, marginLeft, yOffset);
        yOffset += lineHeight;
      }

      // Add a new page if content overflows
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 30;
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
          right: "10px",
          padding: "10px 18px",
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
        <div
          className="chatbot-container container-fluid p-3 bg-white rounded shadow"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "10px",
            width: "90%",
            maxWidth: "400px",
            height: "80vh",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close Button */}
          <button
            className="btn btn-danger rounded-circle position-absolute d-flex justify-content-center align-items-center shadow"
            style={{
              top: "10px",
              right: "10px",
              width: "40px",
              height: "40px",
              zIndex: 2,
              fontSize: "1.2rem",
              lineHeight: "1",
            }}
            onClick={() => setIsOpen(false)}
            aria-label="Close Chat"
          >
            &times;
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
          
          <div className="input-area mb-1 d-flex flex-column justify-content-center ">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ask me anything about travel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

              <div className="d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-primary w-100 w-sm-50" onClick={handleSend}>
                  Send
                </button>
                <button className="btn btn-success w-100 w-sm-50" style={{backgroundColor: "#28a745"}} onClick={downloadPDF}>
                  Download Itinerary as PDF
                </button>
              </div>

          </div>

        </div>
      )}
    </>
  );
}); // Close the forwardRef wrapper

export default Chatbot;
