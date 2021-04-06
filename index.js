const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.micck.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Yay! I'm Creating a Database")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const mobileCollection = client.db("smartCellular").collection("smartphones");
    const orderCollection = client.db("smartCellular").collection("orders");
    console.log("Database Connected Successfully");

    app.post('/addProduct', (req, res) => {
        const newPhone = req.body;
        console.log("Adding new Phone", newPhone);
        mobileCollection.insertOne(newPhone)
            .then(result => {
                console.log('Inserted Count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })

    });

    app.get('/products', (req, res) => {
        mobileCollection.find()
            .toArray((err, items) => {
                console.log("From Database", items);
                res.send(items);
            })
    })

    app.get('/product/:id', (req, res) => {
        mobileCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                console.log("From Database", documents);
                res.send(documents[0]);
            })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log("Getting New Order", newOrder);
        orderCollection.insertOne(newOrder)
            .then(result => {
                console.log('Inserted Count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orderHistory', (req, res) => {
        console.log(req.query.email)
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        mobileCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log("Deleting an item", result.deletedCount)
                res.send(result.deletedCount > 0)
            })
    })
})



app.listen(port)