const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config({ path: 'config.env' });
const url = process.env.MONGODB_URL;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const bcrypt = require('bcrypt');

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

app.post('/api/login', async (req, res, next) => 
  {
    // incoming: Login, Password
    // outgoing: id, first_name, last_name, error
    
   var error = '';
  
    const { Login, Password } = req.body;
  
    const db = client.db('POOSD-Large-Project');
    const results = await db.collection('Users').find({username:Login, password:Password}).toArray();
    
    var id = -1;
    var fn = '';
    var ln = '';
  
    if( results.length > 0 )
    {
      id = results[0].id;
      fn = results[0].first_name;
      ln = results[0].last_name;
    }
  
    var ret = { id:id, first_name:fn, last_name:ln, error:''};
    res.status(200).json(ret);
});

app.post('/api/signup', async (req, res, next) => {
  // incoming: Login, Password, FirstName, LastName, Email, Allergens(array)
  // outgoing: id, first_name, last_name, error

  let error = '';

  // FRONT END MATCH THESE VARIABLES 
  const { Login, Password, FirstName, LastName, Email, Allergens } = req.body;

  const db = client.db('POOSD-Large-Project');
  const results = await db.collection('Users').find({ username:Login }).toArray();

  let id = -1;
  let fn = '';
  let ln = '';

  if (results.length === 0) {
    // User doesn't exist, create a new one

    // Hash the password
    const SaltRounds = 10;
    const HashedPassword = await bcrypt.hash(Password, SaltRounds);

    const newUser = {
      username: Login,
      password: HashedPassword,
      first_name: FirstName,
      last_name: LastName,
      email: Email,
      allergens: Allergens || [],
      favorites: []
    };

    const insertResult = await db.collection('Users').insertOne(newUser);
    id = insertResult.insertedId;
    fn = FirstName;
    ln = LastName;
  } else {
    // User already exists, return an error
    error = 'User already exists';
  }

  const ret = { id: id, first_name: fn, last_name: ln, error };
  res.status(200).json(ret);
});

app.post('/api/addfavorite', async (req, res, next) => {
  // Incoming: Login (username), RecipeID 
  // Outgoing: id, first_name, last_name, error
  
  let error = '';
  
  // Destructure the incoming request body
  const { Login, Recipe } = req.body;  // Recipe will be an object like { id, title, image, etc. }
  
  const db = client.db('POOSD-Large-Project');
  
  try {
    // Find the user by username
    const user = await db.collection('Users').findOne({ username: Login });

    if (!user) {
      // If the user doesn't exist
      error = 'User not found';
      return res.status(404).json({ error });
    }

    // Push the new recipe into the user's favorites array
    const updateResult = await db.collection('Users').updateOne(
      { username: Login },
      { $push: { favorites: Recipe } }
    );

    if (updateResult.modifiedCount > 0) {
      // If the update was successful
      return res.status(200).json({
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        error: 'Success'
      });
    } else {
      error = 'Failed to add favorite recipe';
      return res.status(500).json({ error });
    }
  } catch (err) {
    console.error('Error adding favorite recipe:', err);
    error = 'Error adding favorite';
    res.status(500).json({ error });
  }

  const ret = {error};
  res.status(200).json(ret);
});


// Endpoint to search recipes
app.get('/api/searchRecipes', async (req, res) => {
  const query = req.query.q; // Get the search query from request
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const foreign_url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(foreign_url);
    res.json(response.data); // Return the API response data to the client
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});
  
app.listen(5000, '0.0.0.0', () => console.log('Server running on port 5000'));
  
