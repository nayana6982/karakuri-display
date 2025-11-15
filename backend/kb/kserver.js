import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB using URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema for your collection
// Using strict: false to allow all existing fields
const itemSchema = new mongoose.Schema({}, { collection: 'display_items', strict: false });
const Item = mongoose.model('Item', itemSchema);

// Route to fetch all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to fetch a single item by ObjectId
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));