import React, { useState, useEffect } from 'react';
import useChatStore from '../store/useChatStore';

const ChatHeader = () => {
  const {
    selectedUser,
    users,
    updateUserStatus,
    toggleTheme,
    theme,
    addNotification
  } = useChatStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    if (selectedUser && selectedUser.lastSeen) {
      const updateLastSeen = () => {
        const now = new Date();
        const lastSeenDate = new Date(selectedUser.lastSeen);
        const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
        
        if (diffInMinutes < 1) {
          setLastSeen('just now');
        } else if (diffInMinutes < 60) {
          setLastSeen(`${diffInMinutes} minutes ago`);
        } else if (diffInMinutes < 1440) {
          const hours = Math.floor(diffInMinutes / 60);
          setLastSeen(`${hours} hour${hours > 1 ? 's' : ''} ago`);
        } else {
          const days = Math.floor(diffInMinutes / 1440);
          setLastSeen(`${days} day${days > 1 ? 's' : ''} ago`);
        }
      };

      updateLastSeen();
      const interval = setInterval(updateLastSeen, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'away': return '#ffc107';
      case 'offline': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return `Last seen ${lastSeen}`;
      default: return 'Unknown';
    }
  };

  const handleStatusChange = (newStatus) => {
    if (selectedUser) {
      updateUserStatus(selectedUser.id, newStatus);
      addNotification(`${selectedUser.name} is now ${newStatus}`);
    }
    setShowUserMenu(false);
  };

  const handleVideoCall = () => {
    addNotification(`Starting video call with ${selectedUser.name}...`);
  };

  const handleVoiceCall = () => {
    addNotification(`Starting voice call with ${selectedUser.name}...`);
  };

  const handleMoreOptions = () => {
    addNotification('More options menu opened');
  };

  if (!selectedUser) return null;

  return (
    <div className="chat-header">
      <style jsx>{`
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: ${theme === 'dark' ? '#2c2c2c' : '#ffffff'};
          border-bottom: 1px solid ${theme === 'dark' ? '#404040' : '#e9ecef'};
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
          z-index: 10;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .user-info:hover {
          background: ${theme === 'dark' ? '#404040' : '#f8f9fa'};
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: 3px solid ${theme === 'dark' ? '#2c2c2c' : '#ffffff'};
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid ${theme === 'dark' ? '#2c2c2c' : '#ffffff'};
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        .user-details h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${theme === 'dark' ? '#ffffff' : '#212529'};
        }

        .user-status {
          font-size: 0.85rem;
          color: ${theme === 'dark' ? '#b8b8b8' : '#6c757d'};
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: ${theme === 'dark' ? '#404040' : '#f8f9fa'};
          color: ${theme === 'dark' ? '#ffffff' : '#495057'};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s ease;
          position: relative;
        }

        .action-btn:hover {
          background: ${theme === 'dark' ? '#555555' : '#e9ecef'};
          transform: scale(1.05);
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .theme-btn {
          background: ${theme === 'dark' ? '#ffc107' : '#495057'};
          color: ${theme === 'dark' ? '#000' : '#fff'};
        }

        .user-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: ${theme === 'dark' ? '#333333' : '#ffffff'};
          border: 1px solid ${theme === 'dark' ? '#505050' : '#dee2e6'};
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 0.5rem 0;
          min-width: 200px;
          z-index: 1000;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: ${theme === 'dark' ? '#ffffff' : '#212529'};
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 0.9rem;
        }

        .menu-item:hover {
          background: ${theme === 'dark' ? '#404040' : '#f8f9fa'};
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .tooltip {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: ${theme === 'dark' ? '#333' : '#000'};
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .action-btn:hover .tooltip {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 0.75rem 1rem;
          }
          
          .avatar {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
          
          .user-details h3 {
            font-size: 1rem;
          }
          
          .user-status {
            font-size: 0.8rem;
          }
          
          .action-btn {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
        <div className="avatar-container">
          <div className="avatar">{selectedUser.avatar}</div>
          <div 
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(selectedUser.status) }}
          />
        </div>
        <div className="user-details">
          <h3>{selectedUser.name}</h3>
          <p className="user-status">{getStatusText(selectedUser.status)}</p>
        </div>

        {showUserMenu && (
          <div className="user-menu">
            <button 
              className="menu-item"
              onClick={() => handleStatusChange('online')}
            >
              <div className="status-dot" style={{ backgroundColor: '#28a745' }}></div>
              Set as Online
            </button>
            <button 
              className="menu-item"
              onClick={() => handleStatusChange('away')}
            >
              <div className="status-dot" style={{ backgroundColor: '#ffc107' }}></div>
              Set as Away
            </button>
            <button 
              className="menu-item"
              onClick={() => handleStatusChange('offline')}
            >
              <div className="status-dot" style={{ backgroundColor: '#6c757d' }}></div>
              Set as Offline
            </button>
          </div>
        )}
      </div>

      <div className="header-actions">
        <button className="action-btn" onClick={handleVideoCall}>
          📹
          <div className="tooltip">Video Call</div>
        </button>
        
        <button className="action-btn" onClick={handleVoiceCall}>
          📞
          <div className="tooltip">Voice Call</div>
        </button>
        
        <button className="action-btn theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
          <div className="tooltip">Toggle Theme</div>
        </button>
        
        <button className="action-btn" onClick={handleMoreOptions}>
          ⋮
          <div className="tooltip">More Options</div>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
