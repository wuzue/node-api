import express, { Request, Response } from 'express';
import { products, categories, connect } from './db';

const app = express();
const port = 3000;

connect();

app.get('/', (req: Request, res: Response) => {
  try {
    res.send(`Hello`);
  } catch (err) {
    console.error(err);
    res.status(401).send('Invalid token');
  }
});

app.get('/products', async (req: Request, res: Response) => {
  try {
    const productList = await products.find().toArray();
    res.send(productList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving products');
  }
});

app.get('/products/:id', async (req: Request, res: Response) => {
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

app.get('/categories', async (req: Request, res: Response) => {
  try{
    const categoryList = await categories.find().toArray();
    res.send(categoryList);
  } catch(err){
    console.error(err);
    res.status(500).send('Error retrieving categories');
  }
});

app.get('/categories/:id', async (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});