const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const googleAuthRoutes = require('./routes/googleAuth.routes');
connectDB();

const cors = require('cors');
const app = express();

const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/v1/voice', require('./routes/voiceRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/seller-applications', require('./routes/sellerApplicationRoutes'));
app.use('/api/flash-sale', require('./routes/flashSaleRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/auth', googleAuthRoutes);

app.get('/api/test-gemini', async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        res.status(200).json({ success: true, text: response.text() });
    } catch (error) {
        console.error('Test Gemini Route Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── Uploaded files ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Serve frontend build from backend public folder ───────────────────────
const publicPath = path.join(__dirname, 'public');
const indexPath = path.join(publicPath, 'index.html');

if (process.env.NODE_ENV === 'production') {
    if (fs.existsSync(publicPath) && fs.existsSync(indexPath)) {
        app.use(express.static(publicPath));

        app.get('*', (req, res) => {
            if (req.path.startsWith('/api')) {
                return res.status(404).json({ message: 'API route not found' });
            }
            res.sendFile(indexPath);
        });
    }
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
