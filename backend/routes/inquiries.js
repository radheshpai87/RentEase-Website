import express from 'express';
import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create inquiry
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const inquiry = new Inquiry({
      property: propertyId,
      name,
      email,
      phone,
      message,
      user: req.user ? req.user._id : undefined
    });

    await inquiry.save();
    await inquiry.populate('property', 'title type price location');

    res.status(201).json({ 
      message: 'Inquiry submitted successfully',
      inquiry
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating inquiry', error: error.message });
  }
});

// Get all inquiries (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      propertyId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (propertyId) filter.property = propertyId;

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    const inquiries = await Inquiry.find(filter)
      .populate('property', 'title type price images')
      .populate({
        path: 'property',
        populate: {
          path: 'location',
          select: 'state city town locality'
        }
      })
      .populate('user', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const totalInquiries = await Inquiry.countDocuments(filter);
    const totalPages = Math.ceil(totalInquiries / limit);

    res.json({
      inquiries,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalInquiries,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get inquiry by ID (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property')
      .populate({
        path: 'property',
        populate: {
          path: 'location',
          select: 'state city town locality pincode'
        }
      })
      .populate('user', 'firstName lastName email phoneNumber');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inquiry status (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    ).populate('property', 'title type price');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: 'Error updating inquiry', error: error.message });
  }
});

// Delete inquiry (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
});

// Get inquiries stats (Admin only)
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });

    // Recent inquiries (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    res.json({
      total: totalInquiries,
      new: newInquiries,
      contacted: contactedInquiries,
      closed: closedInquiries,
      recent: recentInquiries
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;