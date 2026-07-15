import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to analyze voice command
export const analyzeVoice = createAsyncThunk(
    'products/analyzeVoice',
    async (payload, { rejectWithValue }) => {
        // payload can be a plain string (legacy) or { text, currentPath }
        const body = typeof payload === 'string' ? { text: payload } : payload;
        try {
            const response = await axios.post('/api/v1/voice/analyze', body);
            return {
                products: response.data.products || [],
                meta: response.data.ai_meta?.meta || response.data.ai_meta || {},
                intent: response.data.intent || response.data.ai_meta?.intent,
                redirect: response.data.redirect || null,
                cartProduct: response.data.cartProduct || null,
                cartQty: response.data.cartQty || 1,
                action: response.data.action || 'add',
            };
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Internal Server Error' });
        }
    }
);

// Async Thunk to fetch all products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/products?limit=60');
            return response.data.products;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Failed to fetch products' });
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        assistantMessage: '',
        transcript: '',
        status: 'idle',
        error: null,
        voiceResult: null,
        voiceSearchProducts: [],   // persists across resetAssistant so SearchPage can read it
        voiceSearchLabel: '',      // the human-readable search label e.g. "phones under Rs. 50,000"
    },
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setTranscript: (state, action) => {
            state.transcript = action.payload;
        },
        resetAssistant: (state) => {
            state.status = 'idle';
            state.assistantMessage = '';
            state.transcript = '';
            state.voiceResult = null;
            // NOTE: voiceSearchProducts & voiceSearchLabel intentionally NOT cleared here
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(analyzeVoice.pending, (state) => {
                state.status = 'processing';
            })
            .addCase(analyzeVoice.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.products?.length > 0) {
                    state.items = action.payload.products;
                }
                const speech = action.payload.meta?.response_speech || 'Done!';
                state.assistantMessage = speech;
                state.voiceResult = action.payload;
                // Store search results persistently so SearchPage can read from Redux
                if (action.payload.intent === 'SEARCH') {
                    state.voiceSearchProducts = action.payload.products || [];
                    // Build a clean label from the speech: strip "Found N " prefix
                    const clean = speech.replace(/^found \d+ /i, '').replace(/\. prices start.*/i, '');
                    state.voiceSearchLabel = clean || 'voice search';
                }
            })
            .addCase(analyzeVoice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Voice processing failed';
                state.assistantMessage = 'Sorry, I encountered an error. Please try again.';
            })
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            });
    },
});

export const { setStatus, resetAssistant, setTranscript } = productSlice.actions;
export default productSlice.reducer;
