import React, { useState, useRef, useEffect } from 'react';
import useChatStore from '../store/useChatStore';

const MessageInput = () => {
  const {
    selectedUser,
    sendMessage,
    setTyping,
    isTyping,
    addTypingUser,
    theme,
    addNotification
  } = useChatStore();

  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕',
    '💖', '💗', '💘', '💝', '💞', '💟', '💔', '❣️', '💋', '💯'
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (value.trim() && selectedUser) {
      if (!isTyping) {
        setTyping(true);
        addTypingUser(selectedUser);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 1000);
    } else {
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      sendMessage(message);
      setMessage('');
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      textareaRef.current?.focus();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  const handleFileUpload = () => {
    addNotification('File upload feature coming soon!');
  };

  const handleImageUpload = () => {
    addNotification('Image upload feature coming soon!');
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      addNotification('Voice message recorded!');
    } else {
      setIsRecording(true);
      addNotification('Recording voice message...');
      // Auto stop after 30 seconds
      setTimeout(() => {
        setIsRecording(false);
      }, 30000);
    }
  };

  const quickResponses = [
    '👍', '❤️', '😂', '😮', '😢', '👏'
  ];

  if (!selectedUser) return null;

  return (
    <div className="message-input-container">
      <style jsx>{`
        .message-input-container {
          padding: 1rem 1.5rem;
          background: ${theme === 'dark' ? '#2c2c2c' : '#ffffff'};
          border-top: 1px solid ${theme === 'dark' ? '#404040' : '#e9ecef'};
        }

        .quick-responses {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          padding: 0.25rem 0;
        }

        .quick-response {
          background: ${theme === 'dark' ? '#404040' : '#f8f9fa'};
          border: none;
          border-radius: 20px;
          padding: 0.5rem 0.75rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .quick-response:hover {
          background: ${theme === 'dark' ? '#555555' : '#e9ecef'};
          transform: scale(1.1);
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          background: ${theme === 'dark' ? '#404040' : '#f8f9fa'};
          border-radius: 24px;
          padding: 0.75rem 1rem;
          border: 2px solid transparent;
          transition: border-color 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #007bff;
        }

        .input-actions-left {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .action-button {
          background: none;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: ${theme === 'dark' ? '#b8b8b8' : '#6c757d'};
        }

        .action-button:hover {
          background: ${theme === 'dark' ? '#555555' : '#e9ecef'};
          transform: scale(1.1);
        }

        .action-button.active {
          background: #007bff;
          color: white;
        }

        .action-button.recording {
          background: #dc3545;
          color: white;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .message-textarea {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: ${theme === 'dark' ? '#ffffff' : '#212529'};
          font-size: 1rem;
          line-height: 1.4;
          resize: none;
          min-height: 24px;
          max-height: 120px;
          font-family: inherit;
        }

        .message-textarea::placeholder {
          color: ${theme === 'dark' ? '#888888' : '#6c757d'};
        }

        .send-button {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-button:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        .send-button:disabled {
          background: ${theme === 'dark' ? '#555555' : '#6c757d'};
          cursor: not-allowed;
          transform: none;
        }

        .emoji-picker {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: ${theme === 'dark' ? '#333333' : '#ffffff'};
          border: 1px solid ${theme === 'dark' ? '#505050' : '#dee2e6'};
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.5rem;
          max-width: 320px;
          max-height: 240px;
          overflow-y: auto;
          z-index: 1000;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .emoji-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .emoji-button:hover {
          background: ${theme === 'dark' ? '#404040' : '#f8f9fa'};
        }

        .emoji-picker::-webkit-scrollbar {
          width: 6px;
        }

        .emoji-picker::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#333' : '#f1f1f1'};
        }

        .emoji-picker::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#555' : '#c1c1c1'};
          border-radius: 3px;
        }

        .typing-indicator-self {
          font-size: 0.8rem;
          color: ${theme === 'dark' ? '#888888' : '#6c757d'};
          margin-bottom: 0.5rem;
          padding-left: 1rem;
        }

        @media (max-width: 768px) {
          .message-input-container {
            padding: 0.75rem 1rem;
          }
          
          .quick-responses {
            margin-bottom: 0.5rem;
          }
          
          .input-wrapper {
            padding: 0.5rem 0.75rem;
          }
          
          .action-button {
            width: 28px;
            height: 28px;
            font-size: 1.1rem;
          }
          
          .send-button {
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
          }
          
          .emoji-picker {
            max-width: 280px;
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>

      {isTyping && (
        <div className="typing-indicator-self">You are typing...</div>
      )}

      <div className="quick-responses">
        {quickResponses.map((emoji, index) => (
          <button
            key={index}
            className="quick-response"
            onClick={() => {
              sendMessage(emoji);
              addNotification(`Sent ${emoji}`);
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="input-wrapper">
        <div className="input-actions-left">
          <button 
            className="action-button"
            onClick={handleFileUpload}
            title="Attach file"
          >
            📎
          </button>
          
          <button 
            className="action-button"
            onClick={handleImageUpload}
            title="Upload image"
          >
            🖼️
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              className={`action-button ${showEmojis ? 'active' : ''}`}
              onClick={() => setShowEmojis(!showEmojis)}
              title="Insert emoji"
            >
              😊
            </button>
            
            {showEmojis && (
              <div className="emoji-picker">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="emoji-button"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          className="message-textarea"
          placeholder={`Message ${selectedUser.name}...`}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows={1}
        />

        {message.trim() ? (
          <button 
            className="send-button"
            onClick={handleSendMessage}
            title="Send message"
          >
            ➤
          </button>
        ) : (
          <button 
            className={`action-button ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? 'Stop recording' : 'Record voice message'}
          >
            🎤
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
