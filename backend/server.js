console.log("Starting server.js...");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SLA rules: define the deadlines (in days) for each concern by category
const slaRules = {
  "Incident Report": {
    "Delivered Not Received": 60,
    "Item Missing": 60,
    "Pre-Delivery": 60,
    "Returns Related": 120
  },
  "Police Report": {
    "Delivered Not Received": 60,
    "Item Missing": 60
  },
  "Photo Submission": {
    "Damaged/Defective": 30,
    "Wrong Item": 30
  }
};

// GET endpoint to fetch SLA rules
app.get('/api/slas', (req, res) => {
  res.json(slaRules);
});

// POST endpoint to calculate deadline
app.post('/api/calculate', (req, res) => {
  const { category, concern, startDate } = req.body;
  if (!category || !concern || !startDate) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const daysToAdd = slaRules[category] && slaRules[category][concern];
  if (!daysToAdd) {
    return res.status(400).json({ error: 'Invalid category or concern.' });
  }
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return res.status(400).json({ error: 'Invalid start date.' });
  }
  // Calculate the deadline by adding the corresponding days
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + daysToAdd);
  res.json({ deadline: deadline.toISOString().substring(0, 10) });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
