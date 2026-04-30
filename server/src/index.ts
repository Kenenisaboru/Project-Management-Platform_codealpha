// Existing imports retained
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import winston from 'winston';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import commentRoutes from './routes/commentRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

const app: Express = express();
const server = http.createServer(app);

const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  ...envOrigins,
]));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware stack
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin server calls and non-browser clients.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Static files for images
app.use('/static', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/tasks/:taskId/comments', commentRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);

// Health endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'KanuTech Pro API' });
});

// 404 handler
app.use(notFound);
// Global error handler
app.use(errorHandler);

// Socket.io Connection
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('joinProject', (projectId: string) => {
    socket.join(projectId);
    logger.info(`User ${socket.id} joined project room: ${projectId}`);
  });

  socket.on('leaveProject', (projectId: string) => {
    socket.leave(projectId);
    logger.info(`User ${socket.id} left project room: ${projectId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow_prox';

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB Atlas'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

export { io, logger };
