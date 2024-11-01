const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URL;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/login', async (req, res, next) => {
  const { Login, Password } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({ login: Login, password: Password }).toArray();

  let fn = '';
  let ln = '';
  if (results.length > 0) {
    fn = results[0].first_name;
    ln = results[0].last_name;
  }

  res.status(200).json({ first_name: fn, last_name: ln, error: '' });
});

app.listen(5000); // start Node + Express server on port 5000
    
