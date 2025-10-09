import React, { useState, useEffect } from 'react';

const FlashSaleBanner = () => {

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

  return (
    <div style={{
      width: '100%',
      padding: '2rem 0',
      margin: '3rem 0',
      position: 'relative',
    }}>
      {/* Main Container */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          {/* Left Side - Title and Description */}
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '1.5rem',
            }}>
              <span>⚡</span>
              <span>Flash Sale</span>
            </div>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#1f2937',
              margin: '0 0 1rem 0',
              lineHeight: 1.1,
            }}>
              Limited Time
              <span style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>Offers</span>
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              lineHeight: 1.6,
              margin: 0,
            }}>
              Don't miss out on these incredible deals! Shop now before they're gone.
            </p>
          </div>

          {/* Right Side - Flash Sale Countdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '200px',
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#9ca3af',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textAlign: 'center',
            }}>
              Sale Ends In:
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}>
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  minWidth: '40px',
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#1f2937',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{formatTime(value)}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#9ca3af',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>{unit.slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flash Sale Info Section */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(255, 107, 53, 0.05)',
          borderRadius: '16px',
          border: '2px dashed #ff6b35',
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1rem',
          }}>
            🔥 Flash Sale Active!
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            margin: 0,
          }}>
            Check out our Products page for the latest flash sale deals and discounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
