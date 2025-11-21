import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import apiClient from '../api/client';

// Mock API client
vi.mock('../api/client');

describe('TableCRM Mobile Order Flow', () => {
    const TEST_TOKEN = 'af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77';

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        window.history.pushState({}, '', '/');
        window.alert = vi.fn(); // Mock alert

        // Default mock implementation
        apiClient.get.mockImplementation((url) => {
            if (url.includes('contragents')) return Promise.resolve({ data: { result: [{ id: 1, name: 'Test Client', phone: '79991234567' }] } });
            if (url.includes('warehouses')) return Promise.resolve({ data: { result: [{ id: 1, name: 'Main Warehouse' }] } });
            if (url.includes('organizations')) return Promise.resolve({ data: { result: [{ id: 1, name: 'My Org' }] } });
            if (url.includes('pboxes')) return Promise.resolve({ data: { result: [{ id: 1, name: 'Cash' }] } });
            if (url.includes('price_types')) return Promise.resolve({ data: { result: [{ id: 1, name: 'Retail' }] } });
            if (url.includes('nomenclature')) return Promise.resolve({ data: { result: [{ id: 101, name: 'Product A', price: 100 }, { id: 102, name: 'Product B', price: 200 }] } });
            return Promise.reject(new Error('Not found'));
        });

        apiClient.post.mockResolvedValue({ data: { success: true } });
    });

    it('should extract token from URL and load metadata immediately', async () => {
        // Simulate URL with token
        window.history.pushState({}, '', `/${TEST_TOKEN}`);

        await act(async () => {
            render(<App />);
        });

        // Should NOT show login form
        expect(screen.queryByText('TableCRM Login')).not.toBeInTheDocument();

        // Should show Order Form
        expect(screen.getByText('Новый заказ')).toBeInTheDocument();

        // Should have called metadata endpoints
        await waitFor(() => {
            expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('warehouses'));
        });

        // Verify localStorage was updated
        expect(localStorage.getItem('tablecrm_token')).toBe(TEST_TOKEN);
    });

    it.skip('should complete full order journey via login form', async () => {
        const user = userEvent.setup();
        render(<App />);

        // 1. Login
        expect(screen.getByText('TableCRM Login')).toBeInTheDocument();
        await user.type(screen.getByPlaceholderText('Enter your API token'), TEST_TOKEN);
        await user.click(screen.getByText('Continue'));

        // 2. Client Selection
        await waitFor(() => expect(screen.getByText('Новый заказ')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText('Поиск по телефону или имени...');
        await user.type(searchInput, '7999');

        await waitFor(() => {
            expect(screen.getByText('Test Client')).toBeInTheDocument();
        });

        // Use fireEvent on the li element to ensure the click registers
        const clientOption = screen.getByText('Test Client').closest('li');
        fireEvent.click(clientOption);

        await waitFor(() => {
            expect(screen.getByText(/Выбран: Test Client/)).toBeInTheDocument();
        });

        // 3. Metadata Selection
        fireEvent.change(screen.getByLabelText(/Организация/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Склад/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Тип цены/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Счет/), { target: { value: '1' } });

        // 4. Product Selection
        await waitFor(() => expect(screen.getByText('Product A')).toBeInTheDocument());

        // Find "Add" buttons. The structure is complex, so we find by text within the product card context
        const addButtons = screen.getAllByText('Добавить');
        await user.click(addButtons[0]); // Add Product A
        await user.click(addButtons[1]); // Add Product B

        // Verify Cart
        expect(screen.getByText('Итоговый заказ')).toBeInTheDocument();
        // Product A should be in the list AND in the cart (2 occurrences)
        expect(screen.getAllByText('Product A')).toHaveLength(2);
        expect(screen.getAllByText('Product B')).toHaveLength(2);
        expect(screen.getByText('300 ₽')).toBeInTheDocument(); // Total

        // 5. Submit
        await user.type(screen.getByPlaceholderText('Заметки к заказу...'), 'Test Order');
        await user.click(screen.getByText('Создать заказ'));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith(
                expect.stringContaining('docs_sales'),
                expect.objectContaining({
                    contragent_id: 1,
                    warehouse_id: '1',
                    products: expect.arrayContaining([
                        expect.objectContaining({ nomenclature_id: 101, quantity: 1 }),
                        expect.objectContaining({ nomenclature_id: 102, quantity: 1 })
                    ])
                })
            );
        });
    });
});
