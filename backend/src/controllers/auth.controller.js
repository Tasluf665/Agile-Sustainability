import crypto from 'crypto';
import User from '../models/User.model.js';
import Token from '../models/Token.model.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.utils.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, organization, role, avatarUrl } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      fullName: name,
      email,
      passwordHash: password,
      organization,
      role,
      avatarUrl,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    // Create verification url
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;
    
    console.log('Verification URL generated:', verifyUrl);

    const message = `Please verify your email by clicking the link: \n\n ${verifyUrl}`;
    const html = `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verifyUrl}" style="background-color: #1c5f20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link: ${verifyUrl}</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - Agile Sustainability',
        message,
        html
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } catch (err) {
      console.log('Email Error:', err);
      // If email fails, we should still have the user but without tokens. 
      // User can request verification email later (once implemented).
      return res.status(500).json({ success: false, message: 'Registration successful but verification email could not be sent. Please contact support.' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    console.log('Verification Request Received. Token:', req.params.token);
    
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('No user found or token expired. Searching for token only...');
      const userOnlyToken = await User.findOne({ verificationToken: req.params.token });
      if (userOnlyToken) {
        console.log('User found with token but it is EXPIRED. Expires at:', userOnlyToken.verificationTokenExpires);
      } else {
        console.log('No user found with this token at all.');
      }
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    console.log('User found! Verifying user:', user.email);
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    console.log('User verified successfully.');

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error) {
    console.error('Verification Error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address to log in',
        isNotVerified: true
      });
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      type: 'REFRESH',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email address' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash and set to user
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below within 10 minutes:\n\n ${resetUrl}`;
    const html = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Please click the button below to set a new password:</p>
      <a href="${resetUrl}" style="background-color: #1c5f20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - Agile Sustainability',
        message,
        html
      });

      res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
    } catch (err) {
      console.log('Email Error:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.passwordHash = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (error) {
    next(error);
  }
};
