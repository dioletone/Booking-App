import jwt from 'jsonwebtoken';
import { createError } from './error.js';

const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    next(createError(401, 'You are not authenticated'));
  } else 
  {jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      next(createError(403, 'Token is not valid'));
    } else {
      req.user = user; // Attach decoded user to request object
      next();
    }
  });}
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'You are not authorized!'));
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user) {
      return next(createError(401, 'You are not authenticated'));
    }
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'You are not admin!'));
    }
  });
};

export { verifyAdmin, verifyUser,verifyToken };
