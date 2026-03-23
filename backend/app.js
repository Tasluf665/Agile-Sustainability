import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './src/config/env.js';
import connectDB from './src/config/db.js';

const app = express();

// Connect to Database
if (config.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes Placeholder
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'GreenStory Backend is running' });
});

// Error Handling Middleware Placeholder (to be implemented next)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: config.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
