import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ 
  message = 'Đang tải...', 
  size = 'medium' 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: '24px',
    medium: '32px', 
    large: '48px'
  };

  const spinnerSize = sizeMap[size];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: '16px'
    }}>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ 
        margin: 0, 
        fontSize: '16px', 
        color: '#666',
        fontWeight: '500'
      }}>
        {message}
      </p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


