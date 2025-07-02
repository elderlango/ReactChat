import React from 'react';

const AuthImagePattern = ({ 
  title = "Welcome to ReactChat", 
  subtitle = "Connect with friends and family instantly",
  className = "" 
}) => {
  const patterns = [
    { icon: "💬", delay: "0s" },
    { icon: "🚀", delay: "0.5s" },
    { icon: "✨", delay: "1s" },
    { icon: "🎉", delay: "1.5s" },
    { icon: "💫", delay: "2s" },
    { icon: "🌟", delay: "2.5s" },
    { icon: "⭐", delay: "3s" },
    { icon: "🔥", delay: "3.5s" },
  ];

  return (
    <div className={`auth-pattern-container ${className}`}>
      <style jsx>{`
        .auth-pattern-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          margin: 1rem;
        }

        .pattern-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 1rem;
          padding: 2rem;
          opacity: 0.1;
        }

        .pattern-item {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          animation: float var(--delay, 0s) infinite alternate;
          animation-duration: 3s;
        }

        @keyframes float {
          from {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          to {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.7;
          }
        }

        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
        }

        .title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          animation: slideInDown 1s ease-out;
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          animation: slideInUp 1s ease-out 0.3s both;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          animation: fadeIn 1s ease-out 0.6s both;
        }

        .feature {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: transform 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
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

        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .pattern-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(8, 1fr);
          }
          
          .pattern-item {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="pattern-grid">
        {Array.from({ length: 48 }, (_, i) => (
          <div 
            key={i}
            className="pattern-item"
            style={{ 
              '--delay': `${(i * 0.1) % 4}s`,
              animationDelay: `${(i * 0.1) % 4}s`
            }}
          >
            {patterns[i % patterns.length].icon}
          </div>
        ))}
      </div>

      <div className="content">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
        
        <div className="features">
          <div className="feature">🔒 Secure Messaging</div>
          <div className="feature">⚡ Real-time Chat</div>
          <div className="feature">🌍 Global Reach</div>
          <div className="feature">📱 Mobile Friendly</div>
          <div className="feature">🎨 Beautiful UI</div>
          <div className="feature">🔔 Notifications</div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
