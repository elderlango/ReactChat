import React, { useState, useEffect } from "react";
import useChatStore from "../store/useChatStore";
import AuthImagePattern from "./AuthImagePattern";

const NoChatSelected = () => {
  const { users, setSelectedUser, theme, currentUser } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedTab, setSelectedTab] = useState("recent");

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#28a745";
      case "away":
        return "#ffc107";
      case "offline":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getLastSeenText = (user) => {
    if (user.status === "online") return "Online";
    if (user.status === "away") return "Away";
    if (user.lastSeen) {
      const now = new Date();
      const lastSeen = new Date(user.lastSeen);
      const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    return "Offline";
  };

  const recentChats = users
    .filter((user) => user.status === "online")
    .slice(0, 3);
  const suggestedUsers = users
    .filter((user) => user.status !== "offline")
    .slice(0, 4);

  const tips = [
    "💡 Use @ to mention someone in group chats",
    "💡 Press Ctrl+Enter to send messages quickly",
    "💡 Double-click on a message to reply",
    "💡 Use emojis to express yourself better",
    "💡 Voice messages are perfect for longer thoughts",
    "💡 Share files by dragging them into the chat",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="no-chat-container">
      <style jsx>{`
        .no-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: ${theme === "dark" ? "#1a1a1a" : "#f8f9fa"};
          overflow-y: auto;
        }

        .header-section {
          padding: 2rem;
          text-align: center;
          background: ${theme === "dark" ? "#2c2c2c" : "#ffffff"};
          border-bottom: 1px solid ${theme === "dark" ? "#404040" : "#e9ecef"};
        }

        .welcome-message {
          color: ${theme === "dark" ? "#ffffff" : "#212529"};
          margin-bottom: 1rem;
        }

        .welcome-message h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-message p {
          color: ${theme === "dark" ? "#b8b8b8" : "#6c757d"};
          font-size: 1.1rem;
        }

        .search-section {
          padding: 1.5rem 2rem;
          background: ${theme === "dark" ? "#2c2c2c" : "#ffffff"};
          border-bottom: 1px solid ${theme === "dark" ? "#404040" : "#e9ecef"};
        }

        .search-box {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid ${theme === "dark" ? "#404040" : "#e9ecef"};
          border-radius: 25px;
          background: ${theme === "dark" ? "#404040" : "#f8f9fa"};
          color: ${theme === "dark" ? "#ffffff" : "#212529"};
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: ${theme === "dark" ? "#888888" : "#6c757d"};
          font-size: 1.2rem;
        }

        .content-section {
          flex: 1;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: ${theme === "dark" ? "#404040" : "#e9ecef"};
          color: ${theme === "dark" ? "#b8b8b8" : "#6c757d"};
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .tab.active {
          background: #007bff;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .user-card {
          background: ${theme === "dark" ? "#2c2c2c" : "#ffffff"};
          border: 1px solid ${theme === "dark" ? "#404040" : "#e9ecef"};
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .user-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #007bff;
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          margin: 0 auto 1rem;
          position: relative;
        }

        .status-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid ${theme === "dark" ? "#2c2c2c" : "#ffffff"};
        }

        .user-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${theme === "dark" ? "#ffffff" : "#212529"};
          margin-bottom: 0.25rem;
        }

        .user-status {
          font-size: 0.85rem;
          color: ${theme === "dark" ? "#b8b8b8" : "#6c757d"};
        }

        .tips-section {
          background: ${theme === "dark" ? "#2c2c2c" : "#ffffff"};
          border: 1px solid ${theme === "dark" ? "#404040" : "#e9ecef"};
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .tip-content {
          font-size: 1rem;
          color: ${theme === "dark" ? "#e1e1e1" : "#495057"};
          animation: fadeInUp 0.5s ease;
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

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: ${theme === "dark" ? "#2c2c2c" : "#ffffff"};
          border: 1px solid ${theme === "dark" ? "#404040" : "#e9ecef"};
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: ${theme === "dark" ? "#b8b8b8" : "#6c757d"};
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: ${theme === "dark" ? "#888888" : "#6c757d"};
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .content-section {
            padding: 1rem;
          }

          .search-section {
            padding: 1rem;
          }

          .header-section {
            padding: 1.5rem 1rem;
          }

          .welcome-message h2 {
            font-size: 1.5rem;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .tab {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="header-section">
        <div className="welcome-message">
          <h2>Welcome back, {currentUser.name}! 👋</h2>
          <p>Choose a conversation or start a new chat</p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="Search for friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="content-section">
        <div className="tabs">
          <button
            className={`tab ${selectedTab === "recent" ? "active" : ""}`}
            onClick={() => setSelectedTab("recent")}
          >
            Recent Chats
          </button>
          <button
            className={`tab ${selectedTab === "suggested" ? "active" : ""}`}
            onClick={() => setSelectedTab("suggested")}
          >
            Suggested
          </button>
          <button
            className={`tab ${selectedTab === "all" ? "active" : ""}`}
            onClick={() => setSelectedTab("all")}
          >
            All Contacts
          </button>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">
              {users.filter((u) => u.status === "online").length}
            </div>
            <div className="stat-label">Online Friends</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Contacts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{recentChats.length}</div>
            <div className="stat-label">Recent Chats</div>
          </div>
        </div>

        {selectedTab === "recent" && (
          <div className="users-grid">
            {recentChats.length > 0 ? (
              recentChats.map((user) => (
                <div
                  key={user.id}
                  className="user-card"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">
                    {user.avatar}
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    />
                  </div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-status">{getLastSeenText(user)}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p>No recent chats</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === "suggested" && (
          <div className="users-grid">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">
                  {user.avatar}
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  />
                </div>
                <div className="user-name">{user.name}</div>
                <div className="user-status">{getLastSeenText(user)}</div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === "all" && (
          <div className="users-grid">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="user-card"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">
                    {user.avatar}
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    />
                  </div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-status">{getLastSeenText(user)}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>No users found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}

        <div className="tips-section">
          <div className="tip-content" key={currentTip}>
            {tips[currentTip]}
          </div>
        </div>

        <AuthImagePattern
          title="Start Chatting!"
          subtitle="Select a friend above to begin your conversation"
        />
      </div>
    </div>
  );
};

export default NoChatSelected;
