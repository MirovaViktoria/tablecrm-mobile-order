import React from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
    const bgColors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6',
        warning: '#F59E0B'
    };

    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: bgColors[type] || bgColors.info,
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '90vw',
            animation: 'slideDown 0.3s ease-out'
        }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{icon[type]}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    padding: '0 4px',
                    opacity: 0.8
                }}
            >
                ×
            </button>
            <style>{`
                @keyframes slideDown {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Toast;
