import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://itenararyplanner.onrender.com");

const Chat = () => {
  const [email, setEmail] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const joinRoom = async () => {
    try {
const res = await axios.post("https://itenararyplanner.onrender.com/api/validate-user", { email });
      if (res.data.valid) {
        socket.emit("join-room", { email, teamCode });
        setJoined(true);
      } else {
        alert("Email not found in user DB.");
      }
    } catch (err) {
      alert("Error validating user.");
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat-message", {
        room: teamCode,
        sender: email,
        text: input,
      });
      setInput("");
    }
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  if (!joined) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Join Chat Room</h2>
        <input placeholder="Email" className="border p-2 w-full mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Team Code" className="border p-2 w-full mb-2" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} />
        <button onClick={joinRoom} className="bg-blue-500 text-white px-4 py-2 rounded">Join</button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Team Code: {teamCode}</h2>
      <div className="border h-64 overflow-y-scroll p-2 bg-gray-100 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.sender}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        className="border p-2 w-full mb-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} style={{backgroundColor: "#28a745"}} className="text-white px-4 py-2 rounded ms-2">Send</button>
    </div>
  );
};

export default Chat;
