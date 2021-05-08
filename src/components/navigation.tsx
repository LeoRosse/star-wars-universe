import React from 'react';
import { Link } from 'react-router-dom';

const style = { border: '1px solid #000', padding: 12 };

interface NavigationProps {
  listOfLink: { label: string; path: string }[];
}

const Navigation: React.FC<NavigationProps> = ({ listOfLink }) => (
  <div style={style}>
    {listOfLink.map(({ label, path }) => (
      <Link to={path}>{label}</Link>
    ))}
  </div>
);

export default Navigation;
