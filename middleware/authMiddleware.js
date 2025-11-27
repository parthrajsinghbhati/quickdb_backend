const jwt = require('jsonwebtoken');

const prisma = require('../config/database.js');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const apiKey = req.header('x-api-key');

  if (apiKey) {
    try {
      const keyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { user: true }
      });

      if (!keyRecord) {
        return res.status(401).json({ message: 'Invalid API Key' });
      }

      // Update last used timestamp
      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() }
      });

      req.user = { userId: keyRecord.userId };
      return next();
    } catch (error) {
      console.error('API Key Auth Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
