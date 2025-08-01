/**
 * @file app.js
 * @description Express uygulamasının ana giriş noktasıdır. Tüm middleware ve rotalar burada yapılandırılır.
 */
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const CustomError = require('./utils/customError');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'https://task-manager-02q1.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

// WebSocket entegrasyonu
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
});

app.set('io', io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotalar
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/', taskRoutes);
app.use(userRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// 404 fallback
app.use((req, res, next) => {
  next(new CustomError(404, 'Route not found'));
});

// 🌐 Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// Test ortamı dışında DB bağlantısı ve sunucuyu başlat
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, io };
