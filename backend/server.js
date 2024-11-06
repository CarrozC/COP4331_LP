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

app.post('/api/login', async (req, res, next) => 
  {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    
   var error = '';
  
    const { login, password } = req.body;
  
    const db = client.db('POOSD-Large-Project');
    const results = await db.collection('Users').find({login:login,password:password}).toArray();
  
    var id = -1;
    var fn = '';
    var ln = '';
  
    if( results.length > 0 )
    {
      id = results[0]._id;
      fn = results[0].first_name;
      ln = results[0].last_name;
    }
  
    var ret = { id:id, first_name:fn, last_name:ln, error:''};
    res.status(200).json(ret);
});

app.use((req, res, next) => 
  {
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
  
app.listen(5000); // start Node + Express server on port 5000
  
