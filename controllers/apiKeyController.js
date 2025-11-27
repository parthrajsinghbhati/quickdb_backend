const prisma = require('../config/database.js');
const crypto = require('crypto');

// Generate a random API key
const generateKey = () => {
  return 'sk_' + crypto.randomBytes(24).toString('hex');
};

// Hash the key for storage (optional, but recommended for security)
// For simplicity in this demo, we'll store it as is, but in production use hashing
// const hashKey = (key) => crypto.createHash('sha256').update(key).digest('hex');

exports.generateApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;
    const key = generateKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        name: name || 'Untitled Key',
        userId
      }
    });

    res.status(201).json(apiKey);
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getApiKeys = async (req, res) => {
  try {
    const userId = req.user.userId;

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(apiKeys);
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    await prisma.apiKey.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
