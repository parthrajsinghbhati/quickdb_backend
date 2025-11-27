const prisma = require('../config/database.js');

exports.createTable = async (req, res) => {
  try {
    const { name, databaseId, columns } = req.body;
    const userId = req.user.userId;

    // Verify database belongs to user
    const database = await prisma.database.findFirst({
      where: {
        id: parseInt(databaseId),
        userId
      }
    });

    if (!database) {
      return res.status(404).json({ message: 'Database not found or access denied' });
    }

    const table = await prisma.table.create({
      data: {
        name,
        databaseId: parseInt(databaseId),
        columns
      }
    });

    res.status(201).json(table);
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTables = async (req, res) => {
  try {
    const { databaseId } = req.query;
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    if (!databaseId) {
      return res.status(400).json({ message: 'Database ID is required' });
    }

    // Verify database belongs to user
    const database = await prisma.database.findFirst({
      where: {
        id: parseInt(databaseId),
        userId
      }
    });

    if (!database) {
      return res.status(404).json({ message: 'Database not found or access denied' });
    }

    const where = {
      databaseId: parseInt(databaseId),
      name: {
        contains: search,
        mode: 'insensitive'
      }
    };

    const [tables, total] = await Promise.all([
      prisma.table.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.table.count({ where })
    ]);

    res.json({
      tables,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const table = await prisma.table.findUnique({
      where: { id: parseInt(id) },
      include: { database: true }
    });

    if (!table || table.database.userId !== userId) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json(table);
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const table = await prisma.table.findUnique({
      where: { id: parseInt(id) },
      include: { database: true }
    });

    if (!table || table.database.userId !== userId) {
      return res.status(404).json({ message: 'Table not found' });
    }

    await prisma.table.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
