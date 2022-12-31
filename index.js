const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// error messages
const error = { error: "result not found in database" }


// mongodb user and password
const uri = "mongodb+srv://admin321:admin321@cluster0.sjzcinr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const contentCollection = client.db("contents").collection("content");

        //Content Post Route http://localhost:5000/add-content
        app.post("/add-content", async (req, res) => {
            const doc = req.body
            const result = await contentCollection.insertOne(doc);
            res.send(result)
        })


        //get all Content Route http://localhost:5000/content
        app.get("/content", async (req, res) => {
            const cursor = contentCollection.find({});
            const allValues = await cursor.toArray();
            res.send(allValues)
        })

        //get all Content Route http://localhost:5000/content/id
        app.get("/content/:_id", async (req, res) => {
            const id = req.params._id;
            const filter = { _id: ObjectId(id) }
            const result = await contentCollection.findOne(filter);
            result ? res.send(result) : res.send(error)

        })




        // APP Root Router
        app.get("/", (req, res) => {
            res.send("Redux app is running")
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('listen to port, ', port);
})