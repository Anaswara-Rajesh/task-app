import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import '../styles/CollapsibleSection.css';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  count,
  children,
  isOpen,
  onToggle
}) => {
  const FiChevronDownIcon = FiChevronDown as React.ElementType;
  const FiChevronUpIcon = FiChevronUp as React.ElementType;

  return (
    <div className="collapsible-section">
      <div 
        className="section-header" 
        onClick={onToggle}
      >
        <div className="header-left">  
          <span className="section-title">{title}</span>
          <span className="section-count">({count})</span>
        </div>
        {isOpen ? <FiChevronUpIcon color="#034EA2"/> : <FiChevronDownIcon color='#034EA2' />}
      </div>
      
      {isOpen && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
};