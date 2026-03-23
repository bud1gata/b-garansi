const Item = require('../models/Item');

// @desc      Get all items for logged in user
// @route     GET /api/items
// @access    Private
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get single item
// @route     GET /api/items/:id
// @access    Private
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user.id }).populate('services');
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Create new item
// @route     POST /api/items
// @access    Private (uses multer for receiptImage)
exports.createItem = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    if (req.file) {
      req.body.receiptImage = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Update item
// @route     PUT /api/items/:id
// @access    Private
exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this item' });
    }

    if (req.file) {
      req.body.receiptImage = `/uploads/${req.file.filename}`;
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Delete item
// @route     DELETE /api/items/:id
// @access    Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
