import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './connection.js';
import userRouter from './routes/user.js';
import auctionRouter from './routes/auction.js';
import auth from './middleware/auth.js';

dotenv.config(); // Load environment variables

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Connect to MongoDB
(async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
})();

// Routes
app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to Online Auction System API' });
});
app.use('/api', userRouter);
app.use('/api/auction', auctionRouter);

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});