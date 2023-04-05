const dotenv = require('dotenv')
import { MongoClient, Collection } from "mongodb";
dotenv.config()

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

export let categories: Collection<Category>;
export let products: Collection<Product>;

const DB_URI = process.env.DB_URI
const client = new MongoClient(DB_URI);

export async function connect() {
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