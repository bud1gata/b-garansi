const Service = require('../models/Service');
const Item = require('../models/Item');

// @desc      Get services for an item
// @route     GET /api/items/:itemId/services
// @access    Private
exports.getServices = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    // Check if item belongs to user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to view services for this item' });
    }

    const services = await Service.find({ item: req.params.itemId }).sort('-date');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Add service record
// @route     POST /api/items/:itemId/services
// @access    Private
exports.addService = async (req, res) => {
  try {
    req.body.item = req.params.itemId;

    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to add a service to this item' });
    }

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Delete service
// @route     DELETE /api/services/:id
// @access    Private
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('item');

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Make sure user owns item
    if (service.item.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this service' });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
