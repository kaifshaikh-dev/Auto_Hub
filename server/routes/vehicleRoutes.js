const express = require('express');
const router = express.Router();
const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  deleteMultipleVehicles,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getVehicles);

router
  .route('/add')
  .post(
    protect,
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
    addVehicle
  );

router
  .route('/bulk-delete')
  .post(protect, deleteMultipleVehicles);

router
  .route('/:id')
  .get(getVehicleById)
  .put(protect, updateVehicle)
  .delete(protect, deleteVehicle);

module.exports = router;
