import React from "react";

function Navbar({onBack, showBack, onLogout }) {
  return (
    <nav className="navbar navbar-expand px-4 py-3" style={{ 
      background: 'linear-gradient(145deg, #0f2b1a 0%, #1a3f25 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
    }}>
      <div className="container-fluid px-0">
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <div style={{
              position: 'absolute',
              inset: '-5px',
              background: 'radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(8px)'
            }}></div>
            <span className="fs-2 position-relative" style={{ 
              filter: 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.5))'
            }}>
              🌿
            </span>
          </div>
          
          <div className="position-relative">
            <h4 className="mb-0 fw-light" style={{ 
              color: '#ffffff',
              letterSpacing: '1px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Eco Watch
            </h4>
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              width: '40%',
              height: '2px',
              background: 'linear-gradient(90deg, #4caf50, transparent)',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {showBack && (
            <button
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
              onClick={onBack}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(76, 175, 80, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ 
                fontSize: '1.2rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}>←</span>
              <span className="fw-medium" style={{ fontSize: '0.95rem' }}>Back</span>
            </button>
          )}

          {onLogout && (
            <button
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
              onClick={onLogout}
              style={{
                background: 'rgba(220, 53, 69, 0.08)',
                border: '1px solid rgba(220, 53, 69, 0.2)',
                color: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              
              <span className="fw-medium" style={{ fontSize: '0.95rem' }}>Logout</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }
        
        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.05) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          pointer-events: none;
        }
        
        .navbar::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 60%);
          animation: rotate 20s linear infinite;
          pointer-events: none;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .fs-2 {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        
        .btn {
          position: relative;
          overflow: hidden;
          font-weight: 400;
        }
        
        .btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.8s, height 0.8s;
        }
        
        .btn:active::after {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
        
        @media (max-width: 576px) {
          .navbar {
            padding: 12px 16px !important;
          }
          
          h4 {
            font-size: 1.1rem !important;
          }
          
          .fs-2 {
            font-size: 1.8rem !important;
          }
          
          .btn {
            padding: 8px 16px !important;
          }
          
          .btn span:last-child {
            display: none; 
          }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          .btn span:last-child {
            font-size: 0.9rem !important;
          }
        }
        
        .btn:active {
          transform: scale(0.98) !important;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(76, 175, 80, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(76, 175, 80, 0.5);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;