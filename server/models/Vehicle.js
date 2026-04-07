const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Dealer',
    },
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    kmDriven: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
    },
    transmission: {
      type: String,
      required: true,
      enum: ['Manual', 'Automatic'],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    video: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
