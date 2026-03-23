import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};
