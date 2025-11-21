import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import ClientSelect from './ClientSelect';
import ProductList from './ProductList';
import Cart from './Cart';
import SelectField from './ui/SelectField';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';

const OrderForm = () => {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Metadata State
    const [warehouses, setWarehouses] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [payboxes, setPayboxes] = useState([]);
    const [priceTypes, setPriceTypes] = useState([]);

    // Form State
    const [client, setClient] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [selectedPaybox, setSelectedPaybox] = useState('');
    const [selectedPriceType, setSelectedPriceType] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            setLoading(true);
            try {
                const [whRes, orgRes, pbRes, ptRes] = await Promise.all([
                    apiClient.get(ENDPOINTS.WAREHOUSES),
                    apiClient.get(ENDPOINTS.ORGANIZATIONS),
                    apiClient.get(ENDPOINTS.PAYBOXES),
                    apiClient.get(ENDPOINTS.PRICE_TYPES)
                ]);

                setWarehouses(whRes.data?.result || []);
                setOrganizations(orgRes.data?.result?.map(org => ({ ...org, name: org.short_name || org.name })) || []);
                setPayboxes(pbRes.data?.result || []);
                setPriceTypes(ptRes.data?.result || []);
            } catch (error) {
                console.error('Error fetching metadata:', error);
                const errorDetails = `
    Status: ${error.response?.status || 'N/A'}
    URL: ${error.config?.url || 'N/A'}
    Message: ${error.message || error}
    Response: ${JSON.stringify(error.response?.data || {})}
                    `.trim();
                alert(`Не удалось загрузить данные формы.\n${errorDetails}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, []);

    const handleAddProduct = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleRemoveItem = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map((item, i) =>
            i === index ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleSubmit = async (isConducted = false) => {
        if (!client || !selectedWarehouse || !selectedOrganization || !selectedPaybox || !selectedPriceType || cartItems.length === 0) {
            alert('Пожалуйста, заполните все обязательные поля и добавьте товары.');
            return;
        }

        setSubmitting(true);
        try {
            const totalSum = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderData = {
                priority: 0,
                dated: Math.floor(Date.now() / 1000), // Current timestamp in seconds
                operation: "Заказ",
                tax_included: true,
                tax_active: true,
                goods: cartItems.map(item => ({
                    price: item.price,
                    quantity: item.quantity,
                    unit: item.unit || 116, // Default to 116 (pcs) if missing
                    discount: 0,
                    sum_discounted: 0,
                    nomenclature: item.id
                })),
                settings: {},
                // loyality_card_id: 0, // Optional, omitted for now as per example
                warehouse: Number(selectedWarehouse),
                contragent: client.id,
                paybox: Number(selectedPaybox),
                organization: Number(selectedOrganization),
                status: false,
                paid_rubles: totalSum,
                paid_lt: 0
            };

            // API expects an array
            const payload = [orderData];

            await apiClient.post(ENDPOINTS.DOCS_SALES, payload);
            alert(`Заказ ${isConducted ? 'создан и проведен' : 'создан'} успешно!`);

            setCartItems([]);
            setComment('');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Не удалось создать заказ. ' + (error.response?.data?.detail || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
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
