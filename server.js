const express = require('express');
const cors = require('cors');

const app = express();

// क्लाउड सर्वर अपने हिसाब से पोर्ट देता है, लोकल के लिए 3000 इस्तेमाल होगा
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // JSON डेटा पढ़ने के लिए
app.use(cors());         // क्रॉस-ओरिजिन रिक्वेस्ट की अनुमति देने के लिए

// डेटा को स्टोर करने के लिए अस्थायी एरे
const savedLocations = [];

/**
 * WhatsApp संदेश भेजने के लिए सहायक फ़ंक्शन (Meta WhatsApp Cloud API का उपयोग)
 */
async function sendWhatsAppMessage(recipientPhone, locationData) {
    try {
        // यहाँ अपनी Meta/WhatsApp Cloud API की डिटेल्स भरें (या पर्यावरण चर - Environment Variables का उपयोग करें)
        const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'YOUR_PERMANENT_ACCESS_TOKEN';
        const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';

        const messageText = `🚨 *CYBER-TRACE ALERT*\nटारगेट नंबर: +${recipientPhone}\nअक्षांश (Lat): ${locationData.latitude}\nदेशांतर (Lng): ${locationData.longitude}\nसटीकता (Accuracy): ${locationData.accuracy || 'N/A'}\nसमय: ${locationData.timestamp || new Date().toLocaleString()}`;

        // Node.js 18+ में इनबिल्ट fetch का उपयोग किया गया है
        const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: recipientPhone, // प्रारूप: देश कोड के साथ, जैसे "919876543210"
                type: "text",
                text: { body: messageText }
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('WhatsApp message safaltapoorvak bhej diya gaya hai:', data);
        } else {
            console.error('WhatsApp API Error:', data);
        }
    } catch (error) {
        console.error('WhatsApp dispatch karne mein samasya aayi:', error.message);
    }
}

// 1. टेस्ट करने के लिए रूट राउट
app.get('/', (req, res) => {
  res.send('Location & WhatsApp Server is running successfully!');
});

// 2. POST Endpoint जो फ्रंटएंड से लोकेशन डेटा रिसीव करेगा
app.post('/api/save-location', async (req, res) => {
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

  // यदि यूजर का मोबाइल नंबर (userId) उपलब्ध है, तो बैकग्राउंड में WhatsApp अलर्ट भेजें
  if (userId) {
    sendWhatsAppMessage(userId, locationRecord);
  }

  // क्लाइंट को सक्सेस मैसेज भेजें
  return res.status(200).json({
    message: 'Location server par safaltapoorvak save ho gayi hai aur WhatsApp alert trigger kar diya gaya hai!',
    data: locationRecord
  });
});

// सर्वर को स्टार्ट करें
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
