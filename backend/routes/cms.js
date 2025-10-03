import express from 'express';
import CMS from '../models/CMS.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get CMS content by type
router.get('/', async (req, res) => {
  try {
    const { type, isActive = true } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (isActive !== 'all') filter.isActive = isActive === 'true';

    const content = await CMS.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get CMS content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await CMS.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create CMS content (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const content = new CMS(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error creating content', error: error.message });
  }
});

// Update CMS content (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const content = await CMS.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error updating content', error: error.message });
  }
});

// Delete CMS content (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const content = await CMS.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error: error.message });
  }
});

// Reorder CMS content (Admin only)
router.put('/reorder/:type', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { type } = req.params;
    const { orders } = req.body; // Array of { id, order }

    const updatePromises = orders.map(({ id, order }) =>
      CMS.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    
    const updatedContent = await CMS.find({ type }).sort({ order: 1 });
    res.json(updatedContent);
  } catch (error) {
    res.status(400).json({ message: 'Error reordering content', error: error.message });
  }
});

export default router;