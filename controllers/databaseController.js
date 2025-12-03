const prisma = require('../config/database.js');
const { validationResult } = require('express-validator');

exports.createDatabase = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description } = req.body;

  try {
    const userId = req.user.userId;

    const database = await prisma.database.create({
      data: {
        name,
        description,
        userId,
      }
    });

    res.status(201).json(database);
  } catch (error) {
    console.error('Create database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDatabases = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const skip = (page - 1) * limit;

    const where = {
      userId,
      name: {
        contains: search,
        mode: 'insensitive'
      }
    };
    
    let orderBy = {};
    if (sortBy === 'name') {
      orderBy = { name: order };
    } else {
      orderBy = { createdAt: order };
    }
    
    const [databases, total] = await Promise.all([
      prisma.database.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: { tables: true }
          }
        }
      }),
      prisma.database.count({ where })
    ]);

    res.json({
      databases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get databases error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDatabaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const database = await prisma.database.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }

    res.json(database);
  } catch (error) {
    console.error('Get database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const database = await prisma.database.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }

    await prisma.database.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Database deleted successfully' });
  } catch (error) {
    console.error('Delete database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
