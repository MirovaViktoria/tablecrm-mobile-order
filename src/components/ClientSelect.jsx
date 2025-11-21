import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

const ClientSelect = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchClients = async (searchQuery) => {
        if (!searchQuery) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const response = await apiClient.get(ENDPOINTS.CONTRAGENTS, {
                params: {
                    name: searchQuery
                }
            });
            setResults(response.data?.result || []);
        } catch (error) {
            console.error('Error searching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (val.length > 2) {
            timeoutRef.current = setTimeout(() => {
                searchClients(val);
            }, 500);
        } else {
            setResults([]);
        }
    };

    const handleSelect = (client) => {
        setQuery(client.name || client.phone || 'Selected Client');
        setIsOpen(false);
        onSelect(client);
    };

    return (
        <div className="form-group" ref={wrapperRef}>
            <label className="label">Клиент <span style={{ color: 'var(--error-color)' }}>*</span></label>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    className="input"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Поиск по телефону или имени..."
                    onFocus={() => setIsOpen(true)}
                />
                {loading && (
                    <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8em'
                    }}>
                        Поиск...
                    </div>
                )}

                {isOpen && results.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        maxHeight: '250px',
                        overflowY: 'auto',
                        zIndex: 50,
                        listStyle: 'none',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '0.5rem 0',
                        margin: 0
                    }}>
                        {results.map((client) => (
                            <li
                                key={client.id}
                                onClick={() => handleSelect(client)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{client.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{client.phone}</div>
                            </li>
                        ))}
                    </ul>
                )}

                {isOpen && query.length > 2 && !loading && results.length === 0 && (
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        padding: '1rem',
                        zIndex: 50,
                        boxShadow: 'var(--shadow-lg)',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        Клиенты не найдены
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientSelect;
