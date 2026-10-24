const express = require('express');
const cors = require('cors');

const app = express();

// क्लाउड सर्वर अपने हिसाब से पोर्ट देता है, लोकल के लिए 3000 इस्तेमाल होगा
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // JSON डेटा पढ़ने के लिए
app.use(cors());         // सभी डोमेन से रिक्वेस्ट की अनुमति देने के लिए

// डेटा को स्टोर करने के लिए अस्थायी एरे
const savedLocations = [];

// 1. रूट राउट (सर्वर चेक करने के लिए)
app.get('/', (req, res) => {
  res.send('Location Server is running successfully!');
});

// 2. Admin Dashboard के लिए GET Endpoint (सीधे savedLocations ऐरे रिटर्न करेगा)
app.get('/api/view-locations', (req, res) => {
  res.status(200).json(savedLocations);
});

// 3. POST Endpoint जो फ्रंटएंड से लोकेशन डेटा रिसीव करेगा
app.post('/api/save-location', (req, res) => {
  const { userId, latitude, longitude, accuracy, timestamp } = req.body;

  // जाँच करें कि डेटा आया है या नहीं
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude aur Longitude zaroori hain.' });
  }

  // लोकेशन का रिकॉर्ड तैयार करें
  const locationRecord = {
    userId,
    latitude,
    longitude,
    accuracy,
    timestamp,
    receivedAt: new Date().toISOString()
  };

  // डेटा को एरे में सेव करें
  savedLocations.push(locationRecord);

  // सर्वर के टर्मिनल/कंसोल में प्रिंट करें
  console.log('--- Nayi Location Prapt Hui ---');
  console.log(locationRecord);

  // क्लाइंट को सक्सेस मैसेज भेजें
  return res.status(200).json({
    message: 'Location server par safaltapoorvak save ho gayi hai!'
  });
});

// सर्वर को start करें
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
