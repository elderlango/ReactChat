import React, { useState, useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const {
    selectedUser,
    currentUser,
    getMessagesForUser,
    markMessagesAsRead,
    typingUsers,
    theme,
  } = useChatStore();

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      const userMessages = getMessagesForUser(selectedUser.id);
      setMessages(userMessages);
      markMessagesAsRead(selectedUser.id);
    }
  }, [selectedUser, getMessagesForUser, markMessagesAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(today - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7)
      return messageDate.toLocaleDateString("en-US", { weekday: "long" });
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  const getMessageStatus = (message) => {
    if (message.sender.id === currentUser.id) {
      switch (message.status) {
        case "sent":
          return "✓";
        case "delivered":
          return "✓✓";
        case "read":
          return "✓✓";
        default:
          return "";
      }
    }
    return "";
  };

  if (!selectedUser) {
    return (
      <div className="no-chat-container">
        <style jsx>{`
          .no-chat-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: ${theme === "dark" ? "#1a1a1a" : "#f8f9fa"};
            color: ${theme === "dark" ? "#e1e1e1" : "#6c757d"};
            text-align: center;
            padding: 2rem;
          }
          .welcome-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%,
            20%,
            50%,
            80%,
            100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
        <div className="welcome-icon">💬</div>
        <h3>Welcome to ReactChat</h3>
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-container" ref={containerRef}>
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: ${theme === "dark" ? "#1a1a1a" : "#ffffff"};
          position: relative;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: ${theme === "dark" ? "#1a1a1a" : "#f8f9fa"};
        }

        .date-separator {
          text-align: center;
          margin: 1rem 0;
          position: relative;
        }

        .date-separator::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: ${theme === "dark" ? "#333" : "#e0e0e0"};
        }

        .date-text {
          background: ${theme === "dark" ? "#1a1a1a" : "#f8f9fa"};
          color: ${theme === "dark" ? "#888" : "#666"};
          padding: 0 1rem;
          font-size: 0.8rem;
          position: relative;
        }

        .message {
          display: flex;
          margin-bottom: 1rem;
          animation: fadeInUp 0.3s ease;
        }

        .message.own {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 0.8rem 1rem;
          border-radius: 18px;
          position: relative;
          word-wrap: break-word;
        }

        .message.own .message-bubble {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message:not(.own) .message-bubble {
          background: ${theme === "dark" ? "#333" : "#e9ecef"};
          color: ${theme === "dark" ? "#fff" : "#000"};
          border-bottom-left-radius: 4px;
        }

        .message-content {
          margin-bottom: 0.3rem;
          line-height: 1.4;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          opacity: 0.7;
        }

        .message.own .message-meta {
          justify-content: flex-end;
        }

        .message-status {
          color: ${theme === "dark" ? "#4ade80" : "#28a745"};
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin: 0 0.5rem;
          flex-shrink: 0;
          background: ${theme === "dark" ? "#333" : "#e9ecef"};
        }

        .message.own .avatar {
          order: 1;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          color: ${theme === "dark" ? "#888" : "#666"};
          font-style: italic;
          animation: fadeIn 0.3s ease;
        }

        .typing-dots {
          display: flex;
          gap: 2px;
        }

        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${theme === "dark" ? "#888" : "#666"};
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#1a1a1a" : "#f1f1f1"};
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: ${theme === "dark" ? "#444" : "#c1c1c1"};
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: ${theme === "dark" ? "#555" : "#a8a8a8"};
        }
      `}</style>

      <ChatHeader />

      <div className="messages-container">
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            {shouldShowDateSeparator(message, messages[index - 1]) && (
              <div className="date-separator">
                <span className="date-text">
                  {formatDate(message.timestamp)}
                </span>
              </div>
            )}

            <div
              className={`message ${
                message.sender.id === currentUser.id ? "own" : ""
              }`}
            >
              {message.sender.id !== currentUser.id && (
                <div className="avatar">{message.sender.avatar}</div>
              )}

              <div className="message-bubble">
                <div className="message-content">{message.text}</div>
                <div className="message-meta">
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender.id === currentUser.id && (
                    <span className="message-status">
                      {getMessageStatus(message)}
                    </span>
                  )}
                </div>
              </div>

              {message.sender.id === currentUser.id && (
                <div className="avatar">{message.sender.avatar}</div>
              )}
            </div>
          </React.Fragment>
        ))}

        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="avatar">{selectedUser.avatar}</div>
            <span>{selectedUser.name} is typing</span>
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
