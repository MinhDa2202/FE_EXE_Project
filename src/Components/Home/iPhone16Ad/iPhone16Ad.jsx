import React, { useState, useEffect } from 'react';

const iPhone16Ad = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 20,
    minutes: 20,
    seconds: 7
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, '0');

  // New Flash Sale Banner Styles
  const containerStyle = {
    width: '100%',
    minHeight: '400px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
    borderRadius: '24px',
    padding: '3rem',
    margin: '3rem 0',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
  };

  const leftSideStyle = {
    flex: 1,
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
  };

  const flashSaleBadgeStyle = {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    animation: 'slideInLeft 1s ease-out both',
  };

  const mainHeadingStyle = {
    marginBottom: '1rem',
    animation: 'slideInLeft 1s ease-out 0.2s both',
  };

  const headingContainerStyle = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const headingLine1Style = {
    fontSize: '3.5rem',
    fontWeight: 900,
    color: '#1f2937',
    margin: 0,
    lineHeight: 1.1,
  };

  const headingLine2Style = {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#ff6b35',
    margin: 0,
    lineHeight: 1.1,
  };

  const subheadingStyle = {
    fontSize: '1.2rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: 1.6,
    animation: 'slideInLeft 1s ease-out 0.4s both',
    maxWidth: '500px',
  };

  const rightSideStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    animation: 'slideInRight 1s ease-out 0.3s both',
  };

  const countdownTitleStyle = {
    fontSize: '1rem',
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const countdownTimerStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  };

  const timeUnitStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: '60px',
  };

  const timeValueStyle = {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#1f2937',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const timeLabelStyle = {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const colonStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#d1d5db',
    marginTop: '-0.5rem',
  };

  const backgroundElementsStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const floatingShapeStyle = (top, right, width, height, color, delay) => ({
    position: 'absolute',
    top: top,
    right: right,
    width: width,
    height: height,
    background: color,
    borderRadius: '50%',
    opacity: 0.03,
    filter: 'blur(40px)',
    animation: `float 8s ease-in-out infinite ${delay}s`,
  });

  return (
    <div style={containerStyle}>
      {/* Background Elements */}
      <div style={backgroundElementsStyle}>
        <div style={floatingShapeStyle('-50px', '-50px', '200px', '200px', 'rgba(255, 107, 53, 0.1)', 0)}></div>
        <div style={floatingShapeStyle('100px', '100px', '150px', '150px', 'rgba(59, 130, 246, 0.08)', 2)}></div>
        <div style={floatingShapeStyle('-30px', '200px', '120px', '120px', 'rgba(139, 92, 246, 0.06)', 4)}></div>
      </div>

      {/* Left Side - Content */}
      <div style={leftSideStyle}>
        {/* Flash Sale Badge */}
        <div style={flashSaleBadgeStyle}>
          <span>⚡</span>
          <span>Flash Sale</span>
        </div>

        {/* Main Heading */}
        <div style={mainHeadingStyle}>
          <div style={headingContainerStyle}>
            <h1 style={headingLine1Style}>Limited Time Offers</h1>
            <h1 style={headingLine2Style}>Up to 70% Off</h1>
          </div>
        </div>

        {/* Subheading */}
        <p style={subheadingStyle}>
          Don't miss out on these incredible deals! Shop now before they're gone.
        </p>
      </div>

      {/* Right Side - Countdown Timer */}
      <div style={rightSideStyle}>
        {/* Countdown Title */}
        <div style={countdownTitleStyle}>
          Sale Ends In:
        </div>

        {/* Countdown Timer */}
        <div style={countdownTimerStyle}>
          <div style={timeUnitStyle}>
            <span style={timeValueStyle}>{formatTime(timeLeft.days)}</span>
            <span style={timeLabelStyle}>Days</span>
          </div>
          
          <span style={colonStyle}>:</span>
          
          <div style={timeUnitStyle}>
            <span style={timeValueStyle}>{formatTime(timeLeft.hours)}</span>
            <span style={timeLabelStyle}>Hours</span>
          </div>
          
          <span style={colonStyle}>:</span>
          
          <div style={timeUnitStyle}>
            <span style={timeValueStyle}>{formatTime(timeLeft.minutes)}</span>
            <span style={timeLabelStyle}>Minutes</span>
          </div>
          
          <span style={colonStyle}>:</span>
          
          <div style={timeUnitStyle}>
            <span style={timeValueStyle}>{formatTime(timeLeft.seconds)}</span>
            <span style={timeLabelStyle}>Seconds</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 1024px) {
          .container {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
            padding: 2rem;
          }
          
          .leftSide {
            max-width: 100%;
            align-items: center;
          }
          
          .headingLine1, .headingLine2 {
            font-size: 2.5rem;
          }
          
          .countdownTimer {
            gap: 0.5rem;
          }
          
          .timeValue {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1.5rem;
            min-height: 350px;
          }
          
          .headingLine1, .headingLine2 {
            font-size: 2rem;
          }
          
          .headingContainer {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
          }
          
          .countdownTimer {
            gap: 0.25rem;
          }
          
          .timeValue {
            font-size: 1.5rem;
          }
          
          .timeUnit {
            min-width: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default iPhone16Ad;
