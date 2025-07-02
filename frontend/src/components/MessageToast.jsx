import React, { useEffect, useState } from 'react';
import useChatStore from '../store/useChatStore';

const MessageToast = () => {
  const { notifications, removeNotification, theme } = useChatStore();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleClose = (id) => {
    // Add exit animation class
    setVisibleNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isExiting: true } : notif
      )
    );
    
    // Remove after animation
    setTimeout(() => {
      removeNotification(id);
    }, 300);
  };

  const getToastIcon = (message) => {
    if (message.includes('call')) return '📞';
    if (message.includes('video')) return '📹';
    if (message.includes('recording') || message.includes('voice')) return '🎤';
    if (message.includes('upload') || message.includes('file')) return '📎';
    if (message.includes('online') || message.includes('offline') || message.includes('away')) return '🟢';
    if (message.includes('error') || message.includes('failed')) return '❌';
    if (message.includes('success') || message.includes('sent')) return '✅';
    return '💬';
  };

  const getToastType = (message) => {
    if (message.includes('error') || message.includes('failed')) return 'error';
    if (message.includes('success') || message.includes('sent') || message.includes('recorded')) return 'success';
    if (message.includes('warning') || message.includes('soon')) return 'warning';
    return 'info';
  };

  const getToastColors = (type) => {
    const colors = {
      error: {
        bg: theme === 'dark' ? '#dc3545' : '#f8d7da',
        border: theme === 'dark' ? '#dc3545' : '#f5c6cb',
        text: theme === 'dark' ? '#ffffff' : '#721c24',
        icon: '#dc3545'
      },
      success: {
        bg: theme === 'dark' ? '#28a745' : '#d4edda',
        border: theme === 'dark' ? '#28a745' : '#c3e6cb',
        text: theme === 'dark' ? '#ffffff' : '#155724',
        icon: '#28a745'
      },
      warning: {
        bg: theme === 'dark' ? '#ffc107' : '#fff3cd',
        border: theme === 'dark' ? '#ffc107' : '#ffeaa7',
        text: theme === 'dark' ? '#000000' : '#856404',
        icon: '#ffc107'
      },
      info: {
        bg: theme === 'dark' ? '#17a2b8' : '#d1ecf1',
        border: theme === 'dark' ? '#17a2b8' : '#bee5eb',
        text: theme === 'dark' ? '#ffffff' : '#0c5460',
        icon: '#17a2b8'
      }
    };
    return colors[type] || colors.info;
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp));
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="toast-container">
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 400px;
          width: 100%;
        }

        .toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid;
          position: relative;
          overflow: hidden;
          animation: slideInRight 0.3s ease-out;
          transition: all 0.3s ease;
        }

        .toast.exiting {
          animation: slideOutRight 0.3s ease-in;
        }

        .toast::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, currentColor, transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .toast-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
          animation: bounce 0.5s ease-out;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        .toast-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .toast-message {
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.4;
          margin: 0;
        }

        .toast-time {
          font-size: 0.75rem;
          opacity: 0.8;
          margin: 0;
        }

        .toast-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          opacity: 0.7;
          transition: all 0.2s ease;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.1);
          transform: scale(1.1);
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: currentColor;
          opacity: 0.3;
          animation: progress 5s linear;
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        .toast-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .toast-action {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: inherit;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toast-action:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
          
          .toast {
            padding: 0.875rem 1rem;
          }
          
          .toast-icon {
            font-size: 1.3rem;
          }
          
          .toast-message {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .toast-container {
            top: 5px;
            right: 5px;
            left: 5px;
          }
          
          .toast {
            padding: 0.75rem 0.875rem;
          }
        }
      `}</style>

      {visibleNotifications.map((notification) => {
        const toastType = getToastType(notification.message);
        const colors = getToastColors(toastType);
        const icon = getToastIcon(notification.message);
        
        return (
          <div
            key={notification.id}
            className={`toast ${notification.isExiting ? 'exiting' : ''}`}
            style={{
              background: colors.bg,
              borderColor: colors.border,
              color: colors.text
            }}
          >
            <div className="toast-icon" style={{ color: colors.icon }}>
              {icon}
            </div>
            
            <div className="toast-content">
              <p className="toast-message">{notification.message}</p>
              <p className="toast-time">{formatTime(notification.timestamp)}</p>
              
              {(notification.message.includes('call') || notification.message.includes('recording')) && (
                <div className="toast-actions">
                  <button className="toast-action">Accept</button>
                  <button className="toast-action">Decline</button>
                </div>
              )}
            </div>
            
            <button 
              className="toast-close"
              onClick={() => handleClose(notification.id)}
              title="Close notification"
              style={{ color: colors.text }}
            >
              ×
            </button>
            
            <div 
              className="progress-bar"
              style={{ color: colors.icon }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageToast;
