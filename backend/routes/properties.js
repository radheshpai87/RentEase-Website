import express from 'express';
import Property from '../models/Property.js';
import Location from '../models/Location.js';
import Category from '../models/Category.js';
import SavedProperty from '../models/SavedProperty.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all properties with filters and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      location,
      state,
      city,
      town,
      locality,
      pincode,
      status = 'available',
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status };

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (bedrooms && bedrooms !== 'all') filter.bedrooms = Number(bedrooms);
    if (bathrooms && bathrooms !== 'all') filter.bathrooms = Number(bathrooms);
    if (minArea) filter.area = { ...filter.area, $gte: Number(minArea) };
    if (maxArea) filter.area = { ...filter.area, $lte: Number(maxArea) };
    if (featured !== undefined) filter.featured = featured === 'true';

    // Location filter
    let locationFilter = {};
    if (state) locationFilter.state = { $regex: state, $options: 'i' };
    if (city) locationFilter.city = { $regex: city, $options: 'i' };
    if (town) locationFilter.town = { $regex: town, $options: 'i' };
    if (locality) locationFilter.locality = { $regex: locality, $options: 'i' };
    if (pincode) locationFilter.pincode = pincode;

    let locationIds = [];
    if (Object.keys(locationFilter).length > 0 || location) {
      if (location) {
        locationFilter = {
          $or: [
            { state: { $regex: location, $options: 'i' } },
            { city: { $regex: location, $options: 'i' } },
            { town: { $regex: location, $options: 'i' } },
            { locality: { $regex: location, $options: 'i' } },
            { pincode: { $regex: location, $options: 'i' } }
          ]
        };
      }
      const locations = await Location.find(locationFilter);
      locationIds = locations.map(loc => loc._id);
      if (locationIds.length > 0) {
        filter.location = { $in: locationIds };
      } else {
        // No matching locations found
        return res.json({
          properties: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalProperties: 0,
            hasNext: false,
            hasPrev: false
          }
        });
      }
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const properties = await Property.find(filter)
      .populate('location', 'state city town locality pincode')
      .populate('category', 'name')
      .populate('owner', 'firstName lastName email phoneNumber')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const totalProperties = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalProperties / limit);

    // Add saved status for authenticated users
    let propertiesWithSavedStatus = properties;
    if (req.user) {
      const savedProperties = await SavedProperty.find({
        user: req.user._id,
        property: { $in: properties.map(p => p._id) }
      });
      const savedPropertyIds = new Set(savedProperties.map(sp => sp.property.toString()));
      
      propertiesWithSavedStatus = properties.map(property => ({
        ...property.toObject(),
        isSaved: savedPropertyIds.has(property._id.toString())
      }));
    }

    res.json({
      properties: propertiesWithSavedStatus,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProperties,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get property by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('location', 'state city town locality pincode')
      .populate('category', 'name')
      .populate('owner', 'firstName lastName email phoneNumber');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    let propertyWithSavedStatus = property.toObject();
    if (req.user) {
      const savedProperty = await SavedProperty.findOne({
        user: req.user._id,
        property: property._id
      });
      propertyWithSavedStatus.isSaved = !!savedProperty;
    }

    res.json(propertyWithSavedStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create property (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user._id
    });
    
    await property.save();
    await property.populate('location category owner');
    
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property', error: error.message });
  }
});

// Update property (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('location category owner');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error updating property', error: error.message });
  }
});

// Delete property (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

// Get user's saved properties
router.get('/user/saved', authenticate, async (req, res) => {
  try {
    const savedProperties = await SavedProperty.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: [
          { path: 'location', select: 'state city town locality pincode' },
          { path: 'category', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(savedProperties.map(sp => ({
      ...sp.property.toObject(),
      isSaved: true,
      savedAt: sp.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save/Unsave property
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if already saved
    const existingSave = await SavedProperty.findOne({
      user: userId,
      property: propertyId
    });

    if (existingSave) {
      // Unsave
      await SavedProperty.deleteOne({ _id: existingSave._id });
      res.json({ message: 'Property removed from saved list', isSaved: false });
    } else {
      // Save
      const savedProperty = new SavedProperty({
        user: userId,
        property: propertyId
      });
      await savedProperty.save();
      res.json({ message: 'Property saved successfully', isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;