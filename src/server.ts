import express, { Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';

const app = express();
const port = 3000;

const DB_URI = 'mongodb+srv://admin:mdsadminkkk@clusterzero.ygwtxel.mongodb.net/menu';

const client = new MongoClient(DB_URI);

// interfaces -> mover pra outro arquivo dps

interface Category{
  id: string;
  parent: Category | null;
  name: string;
}

interface Product {
  id: string;
  categories: string[];
  name: string;
  qty: number;
  price: number;
}

let categories: Collection<Category>;
let products: Collection<Product>;

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('menu');
    categories = db.collection<Category>('categories');
    products = db.collection<Product>('products');
  } catch (err) {
    console.error(err);
  }
}

connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
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
    res.send(category)
  }catch(err){
    console.error(err);
    res.status(500).send('Error retrieving category')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});