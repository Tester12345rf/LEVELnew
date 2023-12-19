const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; // Change to your desired port

app.use(bodyParser.json());

// MongoDB Atlas connection URL
const url =
  'mongodb+srv://UserCRUD:eLvfBXntwQRFQyZn@cluster0.jy9rhsv.mongodb.net/LMSLevel?retryWrites=true&w=majority';

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/updateMongoDB', async (req, res) => {
  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('Level');

    // Search for a document with the specified email
    const email = req.body.email; // Assuming the email is sent in the request body
    const existingDocument = await collection.findOne({ email });

    if (existingDocument) {
      // Email found, update the 'level' field
      const newLevel = req.body.level;
      await collection.updateOne({ email }, { $set: { level: newLevel } });
      client.close();
      res.status(200).send('Update successful');
    } else {
      // Email not found
      client.close();
      res.status(404).send('Email not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
