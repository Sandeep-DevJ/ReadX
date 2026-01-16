import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const isAuthenticated = async (req, res, next) => {
try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'access token is missing or invalid' });
    }

    // Get token from header
    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: 'Token has expired,use refresh token to generate again' });
        }
        return res.status(401).json({ success: false, message: 'access token is missing or invalid' });
      }

      // ✅ Removed duplicate token declaration here
      const {id} = decoded;
      const user = await User.findById(id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // ✅ This is what your controller will use
      req.userId = user._id;
      next();
    });

} catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Keep only one export to avoid confusion
export default isAuthenticated;