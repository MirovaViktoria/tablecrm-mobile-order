import React from 'react';
import Button from './ui/Button';

const Cart = ({ items, onRemove, onUpdateQuantity }) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (items.length === 0) return null;

    return (
        <div className="card" style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
            borderColor: 'var(--border-color)'
        }}>
            <h3 className="label" style={{
                fontSize: '1.1rem',
                color: 'var(--primary-color)',
                marginBottom: '1rem',
                fontWeight: 700
            }}>Итоговый заказ</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {item.price} ₽ x {item.quantity}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >-</button>
                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >+</button>
                            <button
                                onClick={() => onRemove(index)}
                                style={{
                                    marginLeft: '0.5rem',
                                    color: 'var(--error-color)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    lineHeight: 1
                                }}
                            >×</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '2px solid var(--border-color)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--text-primary)'
            }}>
                <span>Итого:</span>
                <span>{total} ₽</span>
            </div>
        </div>
    );
};

export default Cart;
