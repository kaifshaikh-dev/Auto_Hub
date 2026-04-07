const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dealerRoutes = require('./routes/dealerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
    maxAge: 600,
    optionsSuccessStatus: 200,
    preflightContinue: false,

  }
));
app.use(helmet());
app.use(morgan('dev'));

// Static folder for basic uploads if necessary (though using cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/dealers', dealerRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = app;
