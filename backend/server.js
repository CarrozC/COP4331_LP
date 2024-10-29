const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://RickLeinecker:COP4331Rocks@cluster0-4pisv.mongodb.net/COP4331?retryWrites=true&w=majority';
//CHANGE ABOVE
const client = new MongoClient(url);
client.connect();


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
        
     var error = '';
    
      const { login, password } = req.body;
    
      const db = client.db();
      const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
    
      var id = -1;
      var fn = '';
      var ln = '';
    
      if( results.length > 0 )
      {
        id = results[0]._id;
        fn = results[0].name;
        ln = results[0].email;
      }
    
      var ret = { id:id, name:n, email:em, error:''};
      res.status(200).tsxon(ret);
    }
);
    