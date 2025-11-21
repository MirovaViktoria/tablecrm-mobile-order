import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import ClientSelect from './ClientSelect';
return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="fade-in">Загрузка...</div>
    </div>
);
    }

return (
    <div className="container fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 className="title" style={{ margin: 0, textAlign: 'left', fontSize: '1.5rem' }}>Новый заказ</h1>
            <Button variant="secondary" onClick={logout} style={{ width: 'auto', padding: '0.5rem 1rem' }}>Выйти</Button>
        </div>

        <div className="card">
            <ClientSelect onSelect={setClient} />
            {client && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px' }}>
                    <strong>Выбран:</strong> {client.name} ({client.phone})
                </div>
            )}

            <SelectField
                label="Организация"
                value={selectedOrganization}
                onChange={setSelectedOrganization}
                options={organizations}
                placeholder="Выберите..."
                required
            />

            <SelectField
                label="Склад"
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                options={warehouses}
                placeholder="Выберите..."
                required
            />

            <SelectField
                label="Тип цены"
                value={selectedPriceType}
                onChange={setSelectedPriceType}
                options={priceTypes}
                placeholder="Выберите..."
                required
            />

            <ProductList
                onAddProduct={handleAddProduct}
                selectedPriceTypeName={priceTypes.find(pt => pt.id === selectedPriceType)?.name}
            />

            <SelectField
                label="Счет"
                value={selectedPaybox}
                onChange={setSelectedPaybox}
                options={payboxes}
                placeholder="Выберите..."
                required
            />

            <div className="form-group">
                <label className="label">Комментарий</label>
                <textarea
                    className="input"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Заметки к заказу..."
                />
            </div>
        </div>

        {cartItems.length > 0 && (
            <div className="card">
                <Cart
                    items={cartItems}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                />
            </div>
        )}

        <div style={{ display: 'grid', gap: '1rem', marginTop: 'auto' }}>
            <Button onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? 'Создание...' : 'Создать заказ'}
            </Button>
            <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={submitting}>
                {submitting ? 'Обработка...' : 'Создать и провести'}
            </Button>
        </div>
    </div>
);
};

export default OrderForm;
