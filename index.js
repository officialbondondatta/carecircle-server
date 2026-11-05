import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';

const app = express()
const PORT = process.env.PORT || 8000



app.use(cors())
app.use(express.json())


const client = new MongoClient(`${process.env.MONGOURI}`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const connectToDB = await connectToMongoDB()
const database = connectToDB.db("carecircle")
const usersCollection = database.collection("user")
const eventsCollection = database.collection("events")
const joinedEventsCollection = database.collection("joined-events")

const verifyToken = async (req, res, next) => {
    next()
}

app.get('/', (req, res) => {
    res.send("CareCircle Server HomePage")
})

app.get('/user/:email', async (req, res) => {
    const email = req.params.email
    const result = await usersCollection.findOne({
        email: email
    })
    res.send(result)
})

app.post("/join-event", verifyToken, async (req, res) => {
    const data = req.body
    const result = await joinedEventsCollection.insertOne(data)
    res.send(result)
})


app.get("/join-event/:email", verifyToken, async (req, res) => {
    const email = req.params.email
    const result = await joinedEventsCollection.find({ joinedUserEmail: email }).toArray()
    res.send(result)
})

app.delete("/join-event/:id", verifyToken, async (req, res) => {
    const id = req.params.id
    const result = await joinedEventsCollection.deleteOne({
        "event._id": id
    })
    res.send(result)
})

app.post('/create-event', verifyToken, async (req, res) => {
    const data = req.body
    const result = await eventsCollection.insertOne(data)
    res.send(result)
})

app.get('/all-events', async (req, res) => {
    const result = await eventsCollection.find().toArray()
    res.send(result)
})
app.get('/manage-events/:email', verifyToken, async (req, res) => {
    const email = req.params.email
    const result = await eventsCollection.find({ userEmail: email }).toArray()
    res.send(result)
})

app.get('/featured-section', async (req, res) => {
    const result = await eventsCollection.find().sort({ eventDate: 1 }).limit(6).toArray()
    res.send(result)
})

app.patch('/edit-event/:id', verifyToken, async (req, res) => {
    const data = req.body
    const id = req.params.id
    const query = { "_id": new ObjectId(id) }
    const options = { upsert: true }
    const result = await eventsCollection.updateOne(query, {
        $set: {
            title: data.title,
            description: data.description,
            eventType: data.eventType,
            image: data.image,
            eventDate: data.eventDate,
        }
    }, options)

    res.send(result)
})

app.delete("/delete-event/:id", verifyToken, async (req, res) => {
    const id = req.params.id
    const query = { '_id': new ObjectId(id) }
    const result = await eventsCollection.deleteOne(query)
    res.send(result)
})



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})


export default app