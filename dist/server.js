"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
const port = 3000;
const DB_URI = 'mongodb+srv://admin:mdsadminkkk@clusterzero.ygwtxel.mongodb.net/menu';
const client = new mongodb_1.MongoClient(DB_URI);
let categories;
let products;
async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('menu');
        categories = db.collection('categories');
        products = db.collection('products');
    }
    catch (err) {
        console.error(err);
    }
}
connect();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/products', async (req, res) => {
    try {
        const productList = await products.find().toArray();
        res.send(productList);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving products');
    }
});
app.get('/categories', async (req, res) => {
    try {
        const categoryList = await categories.find().toArray();
        res.send(categoryList);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving categories');
    }
});
app.get('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categories.findOne({ id: categoryId });
        if (!category) {
            res.status(404).send('Category not found');
            return;
        }
        res.send(category);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving category');
    }
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
//# sourceMappingURL=server.js.map