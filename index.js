import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient } from 'mongodb';

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
const usersCollection = database.collection("users")
const eventsCollection = database.collection("events")


app.get('/', (req, res) => {
    res.send("CareCircle Server HomePage")
})

app.post('/create-event', async (req, res) => {
    const data = req.body
    const result = await eventsCollection.insertOne(data)
    res.send(result)
})

app.get('/all-events', async (req, res) => {
    const result = await eventsCollection.find().toArray()
    res.send(result)
})




app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})


export default app