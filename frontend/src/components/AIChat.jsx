import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Bot, Send, Loader2, Copy, Trash2, Sparkles } from "lucide-react";

const API = "https://sppu-ai-backend-304115043483.asia-south1.run.app";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const suggestions = [
    "Important DBMS Questions",
    "Explain TOC Unit 3",
    "Computer Network Viva",
    "Java Repeated Questions",
  ];

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function askAI(text = question) {
    if (!text.trim() || loading) return;

    const userQuestion = text.trim();

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/ask`, {
        question: userQuestion,
      });

      let answer;

      if (typeof res.data === "string") {
        answer = res.data;
      } else {
        answer =
          res.data.answer ||
          res.data.response ||
          res.data.result ||
          "No response available.";
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();

      askAI();
    }
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text);
  }

  function clearChat() {
    setMessages([]);
    setQuestion("");
  }

  return (
    <div className="ai-card" id="ai">
      {/* Header */}

      <div className="ai-header">
        <div className="ai-icon">
          <Bot size={28} />
        </div>

        <div>
          <h3>SPPU AI Assistant</h3>

          <p>Powered by RAG + AI</p>
        </div>

        {messages.length > 0 && (
          <button
            className="chat-clear-btn"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>

      {/* Chat Area */}

      <div className="ai-chat-area">
        {messages.length === 0 ? (
          <div className="ai-welcome">
            <div className="ai-welcome-icon">
              <Sparkles size={25} />
            </div>

            <h3>How can I help you?</h3>

            <p>
              Ask anything about SPPU question papers, subjects or exam
              preparation.
            </p>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.role === "user" ? "user-message" : "ai-message"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="message-avatar">
                    <Bot size={17} />
                  </div>
                )}

                <div className="message-content">
                  <div className="message-label">
                    {message.role === "user" ? "You" : "SPPU AI"}
                  </div>

                  <div className="message-bubble">
                    {message.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>

                  {message.role === "assistant" && (
                    <button
                      className="message-copy"
                      onClick={() => copyMessage(message.content)}
                      title="Copy answer"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking */}

            {loading && (
              <div className="chat-message ai-message">
                <div className="message-avatar">
                  <Bot size={17} />
                </div>

                <div className="message-content">
                  <div className="message-label">SPPU AI</div>

                  <div className="message-bubble thinking-bubble">
                    <Loader2 size={17} className="spin" />

                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggestions */}

      {messages.length === 0 && (
        <div className="suggestion-list">
          {suggestions.map((item) => (
            <button
              key={item}
              className="suggestion-chip"
              onClick={() => askAI(item)}
            >
              <Sparkles size={15} />

              {item}
            </button>
          ))}
        </div>
      )}

      {/* Input */}

      <div className="ai-input-area">
        <textarea
          rows={2}
          value={question}
          placeholder="Ask anything about SPPU..."
          maxLength={500}
          disabled={loading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="ai-send-btn"
          disabled={loading || !question.trim()}
          onClick={() => askAI()}
          title="Send"
        >
          {loading ? (
            <Loader2 size={19} className="spin" />
          ) : (
            <Send size={19} />
          )}
        </button>
      </div>

      <div className="chat-info">
        <span>{question.length}/500</span>

        <span>Ctrl + Enter to send</span>
      </div>
    </div>
  );
}

export default AIChat;
