import express, { Request, Response } from 'express';
const jwt = require('jsonwebtoken')
import { products, categories, connect } from './db';
const auth = require('./auth')
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express()

//execute db connection
connect();

//curb cors error by adding a header here
app.use(cors({
    origin: '*', // use your actual domain name (or localhost), using * is not recommended
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "You've got this! Server is running, fam" });
  next();
});

const user_admin = 'boss'
const pass_admin = 'boss123'

app.post('/login', (request, response) => {
  // check if the email and password are equal to the admin credentials
  if (request.body.user === user_admin && request.body.password === pass_admin) {
    // create jwt token
    const token = jwt.sign(
      {
        userId: 1,
        user: request.body.user,
      },
      'RANDOM-TOKEN',
      { expiresIn: '24h' }
    );
    // return success response
    response.status(200).send({
      message: 'Login Successful',
      user: request.body.user,
      token,
    });
  } else {
    // return error response
    response.status(400).send({
      message: 'user or password is incorrect',
    });
  }
});

app.get('/products', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token' });
    }
    // Token is valid, return the products
    try{
      const productList = await products.find().toArray()
      res.send(productList)
    } catch(err){
      res.send(500).send('Error retrieving products')
    }
  });
});

//free endpoint
app.get('/free-endpoint', (request, response) => {
  response.json({ message: "You are allowed to access mt at anytime"})
})
//authentication endpoint
app.get('/auth-endpoint', auth, (request, response) => {
  response.json({ message: "You are authorized to access me now!"})
})

module.exports = app;