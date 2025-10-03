import express from 'express';
import Location from '../models/Location.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all locations with hierarchy
router.get('/', async (req, res) => {
  try {
    const { state, city, town, type = 'all' } = req.query;

    let filter = { isActive: true };
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (town) filter.town = town;

    let result;

    switch (type) {
      case 'states':
        result = await Location.distinct('state', filter);
        break;
      case 'cities':
        result = await Location.distinct('city', filter);
        break;
      case 'towns':
        result = await Location.distinct('town', filter);
        break;
      case 'localities':
        result = await Location.distinct('locality', filter);
        break;
      case 'hierarchy': {
        const locations = await Location.find(filter).sort({ state: 1, city: 1, town: 1, locality: 1 });
        result = locations.reduce((acc, location) => {
          const { state, city, town, locality, pincode } = location;
          
          if (!acc[state]) acc[state] = {};
          if (!acc[state][city]) acc[state][city] = {};
          if (!acc[state][city][town]) acc[state][city][town] = {};
          if (!acc[state][city][town][locality]) acc[state][city][town][locality] = [];
          
          if (!acc[state][city][town][locality].includes(pincode)) {
            acc[state][city][town][locality].push(pincode);
          }
          
          return acc;
        }, {});
        break;
      }
      default:
        result = await Location.find(filter).sort({ state: 1, city: 1, town: 1, locality: 1 });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create location (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: 'Error creating location', error: error.message });
  }
});

// Update location (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(400).json({ message: 'Error updating location', error: error.message });
  }
});

// Delete location (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting location', error: error.message });
  }
});

// Search locations
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = { $regex: query, $options: 'i' };

    const locations = await Location.find({
      isActive: true,
      $or: [
        { state: searchRegex },
        { city: searchRegex },
        { town: searchRegex },
        { locality: searchRegex },
        { pincode: searchRegex }
      ]
    }).limit(20);

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;