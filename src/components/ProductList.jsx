import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import Button from './ui/Button';

const ProductList = ({ onAddProduct, selectedPriceTypeName }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1) {
                setLoading(true);
                try {
                    const response = await apiClient.get(ENDPOINTS.NOMENCLATURE, {
                        params: {
                            name: searchQuery,
                            limit: 100,
                            offset: 0,
                            with_prices: true,
                            with_balance: false,
                            with_attributes: false,
                            with_photos: false,
                            only_main_from_group: false,
                            min_price: 0,
                            sort: 'created_at:desc'
                        }
                    });
                    const allProducts = response.data?.result || [];
                    // Filter by type on client side as API might return mixed types
                    const validProducts = allProducts.filter(p =>
                        p.type === 'product' || p.type === 'service'
                    );
                    setProducts(validProducts);
                } catch (error) {
                    console.error('Error searching products:', error);
                    setProducts([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setProducts([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // No longer needed as we filter during fetch
    const filteredProducts = products;

    const getPrice = (product) => {
        if (!product.prices || product.prices.length === 0) return { price: 0 };

        if (selectedPriceTypeName) {
            const matchedPrice = product.prices.find(p => p.price_type === selectedPriceTypeName);
            if (matchedPrice) return matchedPrice;
        }

        return product.prices[0];
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>Загрузка товаров...</div>;

    return (
        <div className="form-group">
            <label className="label">Товары</label>
            <input
                type="text"
                className="input"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '1rem' }}
            />

            <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
                        Товары не найдены
                    </div>
                ) : (
                    filteredProducts.map((product) => {
                        const currentPrice = getPrice(product);
                        return (
                            <div key={product.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius)',
                                background: 'white',
                                transition: 'box-shadow 0.2s'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{currentPrice.price} ₽</div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => onAddProduct({ ...product, price: currentPrice.price })}
                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    Добавить
                                </Button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProductList;
