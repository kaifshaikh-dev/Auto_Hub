const express = require('express');
const router = express.Router();
const {
  registerDealer,
  loginDealer,
  getDealerProfile,
  getDealerInfo,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require('../controllers/dealerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerDealer);
router.post('/login', loginDealer);
router.post('/google-auth', googleAuth);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

router.get('/profile', protect, getDealerProfile);
router.route('/:id').get(getDealerInfo);

module.exports = router;
