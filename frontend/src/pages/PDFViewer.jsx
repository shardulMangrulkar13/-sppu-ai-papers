import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ArrowLeft,
  Download,
  Bot,
  Send,
  Loader2,
  FileText,
  Plus,
  Copy,
  Trash2,
} from "lucide-react";

const API =
  "https://sppu-ai-backend-304115043483.asia-south1.run.app";

function PDFViewer() {
  const navigate = useNavigate();
  const location = useLocation();

  const filePath = location.state?.path || "";

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, loading]);

  async function askAI(text = question) {
    if (!text.trim() || loading) {
      return;
    }

    const userQuestion = text.trim();

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
        filepath: filePath,
        history: messages,
      });

      const answer =
        typeof res.data === "string"
          ? res.data
          : res.data.answer ||
            res.data.response ||
            res.data.result ||
            "No response available.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      console.error("AI Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  }

  function copyAnswer(text) {
    navigator.clipboard.writeText(text);
  }

  function clearChat() {
    setMessages([]);
    setQuestion("");
  }

  if (!filePath) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        <h2>No PDF Selected</h2>

        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const pdfURL =
    `${API}/preview?path=${encodeURIComponent(filePath)}`;

  const downloadURL =
    `${API}/download?path=${encodeURIComponent(filePath)}`;

  const fileName =
    filePath.split("/").pop();

  return (
    <div className="pdf-page">

      <div className="pdf-toolbar">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <a
          className="download-btn"
          href={downloadURL}
          target="_blank"
          rel="noreferrer"
        >
          <Download size={18} />
          Download
        </a>

      </div>

      <div className="pdf-layout">

        <div className="pdf-viewer">

          <iframe
            src={pdfURL}
            title={fileName}
            className="pdf-iframe"
          />

        </div>

        <div className="pdf-ai">

          <div className="pdf-ai-header">

            <div className="pdf-ai-title-icon">
              <Bot size={24} />
            </div>

            <div>
              <h3>Ask AI</h3>
              <p>Ask anything about this paper</p>
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

          <div className="pdf-chat-area">

            {messages.length === 0 ? (

              <div className="pdf-chat-welcome">

                <div className="welcome-bot-icon">
                  <Bot size={26} />
                </div>

                <h3>Ask about this paper</h3>

                <p>
                  Ask for a question number,
                  question name or answer.
                </p>

                <div className="quick-question">

                  <button
                    onClick={() =>
                      askAI("What is Question 1?")
                    }
                  >
                    What is Question 1?
                  </button>

                  <button
                    onClick={() =>
                      askAI("Give answer for Question 3")
                    }
                  >
                    Answer Question 3
                  </button>

                </div>

              </div>

            ) : (

              <div className="pdf-message-list">

                {messages.map((message, index) => (

                  <div
                    key={index}
                    className={
                      message.role === "user"
                        ? "pdf-chat-message user"
                        : "pdf-chat-message ai"
                    }
                  >

                    {message.role === "assistant" && (
                      <div className="pdf-message-avatar">
                        <Bot size={16} />
                      </div>
                    )}

                    <div className="pdf-message-content">

                      <span className="pdf-message-name">
                        {message.role === "user"
                          ? "You"
                          : "SPPU AI"}
                      </span>

                      <div className="pdf-message-bubble">

                        {message.role === "assistant" ? (

                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                          >
                            {message.content}
                          </ReactMarkdown>

                        ) : (

                          <p>
                            {message.content}
                          </p>

                        )}

                      </div>

                      {message.role === "assistant" && (
                        <button
                          className="copy-message-btn"
                          onClick={() =>
                            copyAnswer(message.content)
                          }
                        >
                          <Copy size={13} />
                          Copy
                        </button>
                      )}

                    </div>

                  </div>

                ))}

                {loading && (

                  <div className="pdf-chat-message ai">

                    <div className="pdf-message-avatar">
                      <Bot size={16} />
                    </div>

                    <div className="pdf-message-content">

                      <span className="pdf-message-name">
                        SPPU AI
                      </span>

                      <div className="pdf-message-bubble thinking">

                        <Loader2
                          size={16}
                          className="spin"
                        />

                        Thinking...

                      </div>

                    </div>

                  </div>

                )}

              </div>

            )}

            <div ref={chatEndRef} />

          </div>

          <div className="pdf-chat-composer">

            <div className="pdf-attachment">

              <button
                className="attachment-plus"
                title="Current paper attached"
              >
                <Plus size={18} />
              </button>

              <FileText size={16} />

              <div className="attachment-info">

                <strong>
                  Paper attached
                </strong>

                <span>
                  {fileName}
                </span>

              </div>

            </div>

            <div className="pdf-input-box">

              <textarea
                rows={2}
                value={question}
                maxLength={500}
                disabled={loading}
                placeholder="Ask anything about this paper..."
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={handleKeyDown}
              />

              <button
                className="pdf-send-btn"
                disabled={
                  loading ||
                  !question.trim()
                }
                onClick={() => askAI()}
                title="Ask AI"
              >

                {loading ? (
                  <Loader2
                    size={18}
                    className="spin"
                  />
                ) : (
                  <Send size={18} />
                )}

              </button>

            </div>

            <div className="pdf-chat-footer">

              <span>
                {question.length}/500
              </span>

              <span>
                Enter to send
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PDFViewer;