const prisma = require('../config/database.js');

exports.createRecord = async (req, res) => {
  try {
    const { tableId } = req.params;
    const data = req.body;
    const userId = req.user.userId;

    // Verify table belongs to user's database
    const table = await prisma.table.findFirst({
      where: {
        id: parseInt(tableId),
        database: {
          userId
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found or access denied' });
    }

    const record = await prisma.record.create({
      data: {
        tableId: parseInt(tableId),
        data
      }
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { tableId } = req.params;
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify table belongs to user's database
    const table = await prisma.table.findFirst({
      where: {
        id: parseInt(tableId),
        database: {
          userId
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found or access denied' });
    }

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where: { tableId: parseInt(tableId) },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.record.count({ where: { tableId: parseInt(tableId) } })
    ]);

    res.json({
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const { tableId, id } = req.params;
    const userId = req.user.userId;

    // Verify table belongs to user's database
    const table = await prisma.table.findFirst({
      where: {
        id: parseInt(tableId),
        database: {
          userId
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found or access denied' });
    }

    const record = await prisma.record.findFirst({
      where: {
        id: parseInt(id),
        tableId: parseInt(tableId)
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { tableId, id } = req.params;
    const data = req.body;
    const userId = req.user.userId;

    // Verify table belongs to user's database
    const table = await prisma.table.findFirst({
      where: {
        id: parseInt(tableId),
        database: {
          userId
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found or access denied' });
    }

    const record = await prisma.record.findFirst({
      where: {
        id: parseInt(id),
        tableId: parseInt(tableId)
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const updatedRecord = await prisma.record.update({
      where: { id: parseInt(id) },
      data: {
        data
      }
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const { tableId, id } = req.params;
    const userId = req.user.userId;

    // Verify table belongs to user's database
    const table = await prisma.table.findFirst({
      where: {
        id: parseInt(tableId),
        database: {
          userId
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found or access denied' });
    }

    const record = await prisma.record.findFirst({
      where: {
        id: parseInt(id),
        tableId: parseInt(tableId)
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await prisma.record.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
