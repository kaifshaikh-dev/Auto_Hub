const Dealer = require('../models/Dealer');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Mailgen = require('mailgen');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new dealer
// @route   POST /api/dealers/register
// @access  Public
const registerDealer = async (req, res) => {
  try {
    const { name, email, password, phone, showroomName, city, whatsappNumber } = req.body;

    const dealerExists = await Dealer.findOne({ email });

    if (dealerExists) {
      return res.status(400).json({ success: false, message: 'Dealer already exists' });
    }

    const dealer = await Dealer.create({
      name,
      email,
      password,
      phone,
      showroomName,
      city,
      whatsappNumber,
    });

    if (dealer) {
      res.status(201).json({
        success: true,
        data: {
          _id: dealer._id,
          name: dealer.name,
          email: dealer.email,
          token: generateToken(dealer._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid dealer data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth dealer & get token
// @route   POST /api/dealers/login
// @access  Public
const loginDealer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const dealer = await Dealer.findOne({ email });

    if (dealer && (await dealer.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: dealer._id,
          name: dealer.name,
          email: dealer.email,
          token: generateToken(dealer._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dealer profile
// @route   GET /api/dealers/profile
// @access  Private
const getDealerProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.dealer._id);

    if (dealer) {
      res.json({
        success: true,
        data: {
          _id: dealer._id,
          name: dealer.name,
          email: dealer.email,
          phone: dealer.phone,
          showroomName: dealer.showroomName,
          city: dealer.city,
          whatsappNumber: dealer.whatsappNumber,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'Dealer not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public dealer info
// @route   GET /api/dealers/:id
// @access  Public
const getDealerInfo = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id).select('-password');
    if (dealer) {
      res.json({ success: true, data: dealer });
    } else {
      res.status(404).json({ success: false, message: 'Dealer not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth dealer with Google
// @route   POST /api/dealers/google-auth
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if dealer already exists
    let dealer = await Dealer.findOne({ email });

    if (dealer) {
      // If dealer exists but doesn't have googleId (signed up via email earlier)
      if (!dealer.googleId) {
        dealer.googleId = googleId;
        await dealer.save();
      }
    } else {
      // Create new dealer
      dealer = await Dealer.create({
        name,
        email,
        googleId,
        // Fill mandatory strings with empty or placeholders as we made them optional
      });
    }

    res.json({
      success: true,
      data: {
        _id: dealer._id,
        name: dealer.name,
        email: dealer.email,
        token: generateToken(dealer._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/dealers/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const dealer = await Dealer.findOne({ email: req.body.email });

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email',
      });
    }

    // 🔐 Generate token
    const resetToken = dealer.getResetPasswordToken();
    await dealer.save({ validateBeforeSave: false });

    // 🌐 Create reset URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const origin = req.headers.origin || `${protocol}://${host}`;

    const resetUrl = `${origin}/dealer/reset-password/${resetToken}`;

    // 🔥 Mailgen setup
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'AutoHub',
        link: origin,
      },
    });

    // 🔥 Email content (professional)
    const emailContent = {
      body: {
        name: dealer.name || 'User',

        intro:
          'You requested to reset your password for your AutoHub account.',

        action: {
          instructions: 'Click the button below to reset your password:',
          button: {
            color: '#0284c7',
            text: 'Reset Password',
            link: resetUrl,
          },
        },

        outro:
          'This link will expire soon. If you did not request this, you can safely ignore this email.',
      },
    };

    // ✅ Generate HTML & TEXT
    const emailHtml = mailGenerator.generate(emailContent);
    const emailText = mailGenerator.generatePlaintext(emailContent);

    try {
      await sendEmail({
        email: dealer.email,
        subject: 'Reset Your Password - AutoHub',
        html: emailHtml,
        message: emailText,
      });

      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
      });

    } catch (err) {
      console.log(err);

      dealer.resetPasswordToken = undefined;
      dealer.resetPasswordExpire = undefined;

      await dealer.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent: ' + err.message,
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Reset Password
// @route   PUT /api/dealers/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const dealer = await Dealer.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!dealer) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    dealer.password = req.body.password;
    dealer.resetPasswordToken = undefined;
    dealer.resetPasswordExpire = undefined;

    await dealer.save();

    res.status(200).json({
      success: true,
      data: {
        _id: dealer._id,
        name: dealer.name,
        email: dealer.email,
        token: generateToken(dealer._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerDealer,
  loginDealer,
  getDealerProfile,
  getDealerInfo,
  googleAuth,
  forgotPassword,
  resetPassword,
};
