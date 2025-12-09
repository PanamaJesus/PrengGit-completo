// components/StatCard.jsx
import React from 'react';
import { ArrowUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, colorIndex, delay = 0 }) => {
  const isPositive = change.startsWith('+');
  
  // Paleta 1: #722323, #BA487F, #FF9587, #FFECCC
  // Paleta 2: #FFECC0, #FFC29B, #F39F9F, #B95E82
  const colors = [
    { bg: '#722323', text: '#FFECCC' },
    { bg: '#BA487F', text: '#FFECCC' },
    { bg: '#FF9587', text: '#722323' },
    { bg: '#F39F9F', text: '#722323' }
  ];
  
  const color = colors[colorIndex % colors.length];
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 hover:-translate-y-1"
      style={{ 
        borderColor: color.bg,
        animationDelay: `${delay}s` 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: '#722323' }}>{title}</p>
          <h3 className="text-3xl font-bold mb-2" style={{ color: '#722323' }}>{value}</h3>
          <div className="flex items-center gap-1">
            <ArrowUp 
              size={16} 
              className={isPositive ? '' : 'rotate-180'}
              style={{ color: isPositive ? '#BA487F' : '#FF9587' }}
            />
            <span 
              className="text-sm font-semibold"
              style={{ color: isPositive ? '#BA487F' : '#FF9587' }}
            >
              {change}
            </span>
            <span className="text-xs ml-1" style={{ color: '#BA487F' }}>vs mes anterior</span>
          </div>
        </div>
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: color.bg }}
        >
          <Icon size={28} style={{ color: color.text }} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;