import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'vstore_cart';

const loadCart = () => {
    try {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = data ? JSON.parse(data) : [];
        // Self-Healing: Filter out invalid items (missing id or price) from previous bugs
        return Array.isArray(parsed) ? parsed.filter(item => item._id && item.price) : [];
    } catch (e) {
        return [];
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCart(),
    },
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1, variant = 'Default' } = action.payload;
            const existingItem = state.items.find(item =>
                item._id === product._id && item.variant === variant
            );

            if (existingItem) {
                existingItem.qty += quantity;
            } else {
                state.items.push({ ...product, qty: quantity, variant });
            }
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            const { id, variant } = action.payload;
            state.items = state.items.filter(item =>
                !(item._id === id && item.variant === variant)
            );
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
        },
        updateQty: (state, action) => {
            const { id, variant, qty } = action.payload;
            const item = state.items.find(i => i._id === id && i.variant === variant);
            if (item && qty > 0) {
                item.qty = qty;
            }
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }
});

// Selectors
export const selectCartTotal = (state) =>
    state.cart.items.reduce((total, item) => total + (item.price * item.qty), 0);

export const selectCartCount = (state) =>
    state.cart.items.reduce((count, item) => count + item.qty, 0);

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
