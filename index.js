
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.zjbav.mongodb.net:27017,cluster0-shard-00-01.zjbav.mongodb.net:27017,cluster0-shard-00-02.zjbav.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-s0cfps-shard-0&authSource=admin&retryWrites=true&w=majority`;



const app = express();
app.use(bodyParser.json());
app.use(cors());


const port = 5000;






MongoClient.connect(uri, function(err, client) {
  const collection = client.db("volunteerWorks").collection("typeOfWorks");
  const volunteersCollection = client.db("volunteerWorks").collection("volunteers");
    
    app.post('/addWorks', (req,res) => {
        const eventDetails = req.body;
        collection.insertOne(eventDetails)
        .then(result =>{
            res.send(result.insertedCount);
        })
    })

    app.get('/works', (req, res)=> {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addVolunteers', (req,res) => {
        const data = req.body;
        volunteersCollection.insertOne(data)
        .then(result =>{
            res.send(result.insertedCount);
        })
    })

    app.get('/userProfile/:email', (req, res)=> {
        volunteersCollection.find({email: req.params.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/getRegisteredUser', (req, res) =>{
        volunteersCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    
    app.delete("/delete/:id", (req, res) =>{
        volunteersCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount)
        })
    })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT ||port);