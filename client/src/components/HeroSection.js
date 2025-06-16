import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  buttons = [],
  overlayOpacity = 0.5 
}) => {
  return (
    <section 
      className="hero-section"
      style={{ 
        backgroundImage: backgroundImage ? `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url(${backgroundImage})` : 'none'
      }}
    >
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <div className="action-buttons">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`hero-btn ${button.variant || 'primary'}`}
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;