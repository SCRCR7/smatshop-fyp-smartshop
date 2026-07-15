import { createSlice } from '@reduxjs/toolkit';

const WISHLIST_STORAGE_KEY = 'vstore_wishlist';

const loadWishlist = () => {
    try {
        const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: loadWishlist(),
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const existingIndex = state.items.findIndex(p => p._id === product._id);

            if (existingIndex >= 0) {
                // Remove
                state.items.splice(existingIndex, 1);
            } else {
                // Add
                state.items.push(product);
            }

            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
        },
        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
        }
    }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (state, productId) =>
    state.wishlist.items.some(p => p._id === productId);

export default wishlistSlice.reducer;
