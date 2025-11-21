import React from 'react';

const SelectField = ({ label, value, onChange, options, placeholder = 'Выберите...', required = false, disabled = false }) => {
    const id = React.useId();
    return (
        <div className="form-group">
            <label className="label" htmlFor={id}>
                {label} {required && <span style={{ color: 'var(--error-color)' }}>*</span>}
            </label>
            <select
                id={id}
                className="select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
