const express = require('express');
const cors = require('cors');

const app = express();

// क्लाउड सर्वर अपने हिसाब से पोर्ट देता है, लोकल के लिए 3000 इस्तेमाल होगा
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // JSON डेटा पढ़ने के लिए
app.use(cors());         // GitHub Pages से आने वाली रिक्वेस्ट को अनुमति देने के लिए

// डेटा को स्टोर करने के लिए अस्थायी एरे
const savedLocations = [];

// 1. टेस्ट करने के लिए रूट राउट
app.get('/', (req, res) => {
  res.send('Location Server is running successfully!');
});

// 2. POST Endpoint: फ्रंटएंड से लोकेशन सेव करने के लिए
app.post('/api/save-location', (req, res) => {
  const { userId, latitude, longitude, accuracy, timestamp } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude aur Longitude zaroori hain.' });
  }

  const locationRecord = {
    userId,
    latitude,
    longitude,
    accuracy,
    timestamp,
    receivedAt: new Date().toISOString()
  };

  savedLocations.push(locationRecord);

  console.log('--- Nayi Location Prapt Hui ---');
  console.log(locationRecord);

  return res.status(200).json({
    message: 'Location server par safaltapoorvak save ho gayi hai!'
  });
});

// 3. GET Endpoint: एडमिन डैशबोर्ड के लिए सभी लोकेशन्स देखने के लिए
app.get('/api/view-locations', (req, res) => {
  res.status(200).json(savedLocations);
});

// सर्वर को स्टार्ट करें
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
