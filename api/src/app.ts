import express, { Request, Response } from 'express';
const jwt = require('jsonwebtoken')
import { products, categories, connect } from './db';
const auth = require('./auth')
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
import { Product, Category } from './db'
const { ObjectId } = require('mongodb');


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

app.get('/product', (req: Request, res: Response) => {
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

app.get('/product/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message: 'no token provided'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'failed to authenticate'})
    }//after token in validated
    try{
    const productId = req.params.id
    const product = await products.findOne({id: productId})
    if(!product){
      res.status(404).send('Product not found')
      return
    }
    res.send(product)
  }catch(err){
    console.error(err);
    res.status(500).send('Error retrieving product')
  }
  })
})

app.get('/category', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message:'no token provided'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'failed to authenticate'})
    }//after token is validated
    try{
      const categoryList = await categories.find().toArray();
      res.send(categoryList);
    } catch(err){
      console.error(err);
      res.status(500).send('Error retrieving categories');
    }
  })
});

app.get('/category/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message: 'no token provided'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'failed to authenticate'})
    }//after token is validated
    try{
      const categoryId = req.params.id
      const category = await categories.findOne({id: categoryId})
      if(!category){
        res.status(404).send('Category not found')
        return
      }
      const productList = await products.find({categories: categoryId}).toArray();
      res.send({category, products: productList});
    }catch(err){
      console.error(err);
      res.status(500).send('Error retrieving category')
    }
  })
})

app.post('/product', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message: 'no token provided'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'failed to authenticate'})
    }//after token is validated
    try {
      const newProduct: Product = req.body
      // find the last product in the collection
      const lastProduct = await products.findOne({}, { sort: { _id: -1 } })
      // set the new product ID to be the last product's ID + 1, or 1 if there are no products
      const newId = lastProduct ? parseInt(lastProduct.id) + 1 : 1
      newProduct.id = newId.toString()
      // insert the new product into the collection
      const result = await products.insertOne(newProduct)
      // find the newly inserted product in the collection and return it
      const insertedProduct = await products.findOne({ _id: result.insertedId })
      res.send(insertedProduct)
    } catch (err) {
      console.error(err)
      res.status(500).send('Error creating product')
    }
  })
})

app.patch('/product/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message: 'no token provided'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'failed to authenticate'})
    }//after token is validated
    const productId = req.params.id;
    const updatedProduct: Product = req.body;
    try {
      const result = await products.findOneAndUpdate({ id: productId }, { $set: updatedProduct });
      if (!result.value) {
        return res.status(404).send('Product not found');
      }
      res.send(result.value);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating product');
    }
  })
});

app.delete('/product/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message: 'no token provided'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, 'RANDOM-TOKEN', async (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'failed to authenticate'})
    }//after token is validated
    try {
      const productId = req.params.id;
      const result = await products.deleteOne({ id: productId });
  
      if (result.deletedCount === 0) {
        res.status(404).send(`Product with id ${productId} not found`);
      } else {
        res.send(`Product with id ${productId} deleted`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting product');
    }
  })
});

module.exports = app;