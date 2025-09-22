const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample product data
const products = [
  {
    id: 1,
    name: "PS5 GamePad",
    descriptions: "Product Description: Introducing the PS5 GamePad, the controller designed to enhance your gaming experience...",
    price: 12000000,
    condition: "New",
    locations: "Hanoi",
    images: [],
    category: "Electronics",
    rating: 5,
    reviews: 142,
    discount: 10,
    createdAt: "2024-01-15T10:30:00Z",
    isActive: true,
  },
  {
    id: 2,
    name: "Gaming Keyboard",
    descriptions: "Product Description: Experience the ultimate gaming keyboard with mechanical switches and RGB lighting...",
    price: 8500000,
    condition: "Like New",
    locations: "Ho Chi Minh City",
    images: [],
    category: "Electronics",
    rating: 4.5,
    reviews: 89,
    discount: 5,
    createdAt: "2024-01-20T14:20:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Gaming Monitor",
    descriptions: "Product Description: 144Hz gaming monitor with ultra-low response time and vibrant colors...",
    price: 9500000,
    condition: "New",
    locations: "Da Nang",
    images: [],
    category: "Electronics",
    rating: 4.8,
    reviews: 203,
    discount: 15,
    createdAt: "2024-01-25T09:15:00Z",
    isActive: true,
  },
];

// API endpoints
app.get('/api/Product', (req, res) => {
  res.json(products);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
