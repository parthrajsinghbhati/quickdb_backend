import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'QuickDB Authentication API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});