import User from '../models/User.model.js';
import Token from '../models/Token.model.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.utils.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, organization, role, avatarUrl } = req.body;

    // Create user
    const user = await User.create({
      fullName: name,
      email,
      passwordHash: password,
      organization,
      role,
      avatarUrl,
    });

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      type: 'REFRESH',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days (should match JWT_REFRESH_EXPIRE)
    });

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        organization: user.organization,
        avatarUrl: user.avatarUrl,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

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
