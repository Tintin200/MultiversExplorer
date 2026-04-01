import React from 'react';

interface CardProps {
  title: string;
  image: string;
  description?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, image, description, onClick }) => {
  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
    </div>
  );
};

export default Card;