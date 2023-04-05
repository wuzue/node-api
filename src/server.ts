import express, { Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';

const app = express();
const port = 3000;

const DB_URI = 'mongodb+srv://admin:<senha>@clusterzero.ygwtxel.mongodb.net/menu';

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

app.get('/categories', async (req: Request, res: Response) => {
  try{
    const categoryList = await categories.find().toArray();
    res.send(categoryList);
  } catch(err){
    console.error(err);
    res.status(500).send('Error retrieving categories');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});