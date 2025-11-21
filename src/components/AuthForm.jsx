import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const AuthForm = () => {
    const { login } = useAuth();
    const [inputToken, setInputToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputToken.trim()) {
            login(inputToken.trim());
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <div className="card fade-in">
                <h1 className="title" style={{ textAlign: 'center' }}>TableCRM Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">API Token</label>
                        <input
                            type="text"
                            className="input"
                            value={inputToken}
                            onChange={(e) => setInputToken(e.target.value)}
                            placeholder="Enter your API token"
                            required
                        />
                    </div>
                    <Button type="submit">Continue</Button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
