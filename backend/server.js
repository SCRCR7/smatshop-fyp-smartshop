const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const googleAuthRoutes = require('./routes/googleAuth.routes');
connectDB();

const cors = require('cors');
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/api/payment', require('./routes/payment.routes'));


app.use('/api/v1/voice', require('./routes/voiceRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/seller-applications', require('./routes/sellerApplicationRoutes'));
app.use('/api/flash-sale', require('./routes/flashSaleRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/uploads', require('express').static(require('path').join(__dirname, 'uploads')));
app.use('/api/auth', googleAuthRoutes);


app.get('/api/test-gemini', async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        res.status(200).json({ success: true, text: response.text() });
    } catch (error) {
        console.error('Test Gemini Route Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
