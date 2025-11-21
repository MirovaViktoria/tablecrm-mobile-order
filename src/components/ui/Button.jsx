import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', style = {} }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} ${className}`}
            style={{
                opacity: disabled ? 0.7 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style
            }}
        >
            {children}
        </button>
    );
};

export default Button;
