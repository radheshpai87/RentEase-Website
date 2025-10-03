import express from 'express';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Inquiry from '../models/Inquiry.js';
import Location from '../models/Location.js';
import Category from '../models/Category.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Dashboard overview stats (Admin only)
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Property stats
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'available' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const rentedProperties = await Property.countDocuments({ status: 'rented' });
    const featuredProperties = await Property.countDocuments({ featured: true });

    // User stats
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Inquiry stats
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });

    // Location and Category stats
    const totalLocations = await Location.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments({ isActive: true });

    // Recent activity (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentProperties = await Property.countDocuments({
      createdAt: { $gte: lastWeek }
    });
    const recentInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: lastWeek }
    });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    // Property type distribution
    const propertyTypes = await Property.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly inquiries (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyInquiries = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      properties: {
        total: totalProperties,
        active: activeProperties,
        sold: soldProperties,
        rented: rentedProperties,
        featured: featuredProperties,
        recent: recentProperties,
        byType: propertyTypes
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
        regular: regularUsers,
        recent: recentUsers
      },
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
        contacted: contactedInquiries,
        closed: closedInquiries,
        recent: recentInquiries,
        monthly: monthlyInquiries
      },
      locations: totalLocations,
      categories: totalCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Recent activities (Admin only)
router.get('/activities', authenticate, authorize('admin'), async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    // Recent properties
    const recentProperties = await Property.find()
      .populate('location', 'city state')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title type price status createdAt');

    // Recent inquiries
    const recentInquiries = await Inquiry.find()
      .populate('property', 'title type')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email status createdAt');

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('firstName lastName email role createdAt');

    res.json({
      properties: recentProperties,
      inquiries: recentInquiries,
      users: recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Property analytics (Admin only)
router.get('/analytics/properties', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = Number(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Properties created over time
    const propertiesOverTime = await Property.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Price distribution
    const priceRanges = await Property.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 25000, 50000, 75000, 100000, 150000, 200000, Number.MAX_VALUE],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Status distribution
    const statusDistribution = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Location-wise distribution (top 10)
    const locationDistribution = await Property.aggregate([
      {
        $lookup: {
          from: 'locations',
          localField: 'location',
          foreignField: '_id',
          as: 'locationData'
        }
      },
      { $unwind: '$locationData' },
      {
        $group: {
          _id: {
            city: '$locationData.city',
            state: '$locationData.state'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      propertiesOverTime,
      priceRanges,
      statusDistribution,
      locationDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;