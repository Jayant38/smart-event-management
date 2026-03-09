import { useState } from "react";
import api from "../api/axiosConfig";

const EventChatbot = () => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 Ask me about events like 'AI events', 'cheap events', or 'conference'." }
  ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = message;

    setMessages(prev => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    setMessage("");
    setLoading(true);

    try {

      const res = await api.get(
        `/events/chatbot?query=${encodeURIComponent(userMessage)}`
      );

      const events = res.data;

      let botReply;

      if (!events || events.length === 0) {

        botReply = "❌ No events found.";

      } else {

        botReply = events
          .map(e => `${e.title} (₹${e.price})`)
          .join(", ");

      }

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: botReply }
      ]);

    } catch (err) {

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Error fetching events." }
      ]);

    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { sender: "bot", text: "Chat cleared. Ask about events again." }
    ]);
  };

  return (

    <div>

      {/* Floating Button */}

      <button
        className="btn btn-primary shadow"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "22px"
        }}
        onClick={() => setOpen(!open)}
      >
        🤖
      </button>

      {open && (

        <div
          className="card shadow"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "430px",
            zIndex: 1000
          }}
        >

          {/* HEADER */}

          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

            <span>AI Event Assistant</span>

            <div>

              <button
                className="btn btn-sm btn-light me-2"
                onClick={clearChat}
              >
                Clear
              </button>

              <button
                className="btn btn-sm btn-light"
                onClick={() => setOpen(false)}
              >
                ✖
              </button>

            </div>

          </div>

          {/* CHAT BODY */}

          <div
            className="card-body"
            style={{
              overflowY: "auto",
              height: "270px",
              background: "#f8f9fa"
            }}
          >

            {messages.map((m, i) => (

              <div
                key={i}
                className={`mb-2 ${m.sender === "user" ? "text-end" : ""}`}
              >

                <span
                  className={`badge ${
                    m.sender === "user"
                      ? "bg-primary"
                      : "bg-secondary"
                  }`}
                  style={{
                    fontSize: "13px",
                    padding: "8px 10px"
                  }}
                >
                  {m.text}
                </span>

              </div>

            ))}

            {loading && (
              <div className="text-muted small">Bot typing...</div>
            )}

          </div>

          {/* INPUT AREA */}

          <div className="card-footer d-flex">

            <input
              className="form-control me-2"
              placeholder="Ask about events..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button
              className="btn btn-success"
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

        </div>

      )}

    </div>

  );

};

export default EventChatbot;